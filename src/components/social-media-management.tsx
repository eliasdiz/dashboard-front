"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Edit,
  Filter,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  Store,
  Building,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Business } from "@/types/types";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import axios from "axios";


interface Post {
  name: string;
  languageCode: string;
  summary: string;
  callToAction?: {
    actionType: "CALL" | "WEBSITE" | "LEARN_MORE" | "BOOK" | "SIGN_UP" | "GET_OFFER";
  };
  state: "LIVE" | "PENDING" | "REJECTED" | "DELETED";
  updateTime: string;
  createTime: string;
  searchUrl?: string;
  media?: {
    name: string;
    mediaFormat: "PHOTO" | "VIDEO";
    googleUrl?: string;
  }[];
  topicType: "STANDARD" | "EVENT" | "OFFER";
}


export function SocialMediaManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [swipeState, setSwipeState] = useState<{ [key: string]: number }>({});
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [businessSearchTerm, setBusinessSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [newPost, setNewPost] = useState({
    content: "",
    image: {
      url: "",
      revised_prompt: "",
    },
    platform: "google",
    status: "published",
  });
  const [isGenerating, setIsGenerating] = useState(false);


  const touchStartX = useRef<{ [key: string]: number }>({});

  // Handle post expansion
  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    if (!selectedBusiness) return toast.error("Please select a business first");
    generateMarketingContent(selectedBusiness.id as string);
    setNewPost({ ...newPost, content: "", image: { url: "", revised_prompt: "" } });
    setIsComposerOpen(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "REJECTED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  // Handle touch start for swipe gestures
  const handleTouchStart = (e: React.TouchEvent, postId: string) => {
    touchStartX.current[postId] = e.touches[0].clientX;
  };

  // Handle touch move for swipe gestures
  const handleTouchMove = (e: React.TouchEvent, postId: string) => {
    if (!touchStartX.current[postId]) return;

    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current[postId] - touchX;

    // Limit swipe to left and to a maximum distance
    if (diff > 0 && diff < 100) {
      setSwipeState({
        ...swipeState,
        [postId]: -diff,
      });
    }
  };

  // Handle touch end for swipe gestures
  const handleTouchEnd = (postId: string) => {
    const swipeDistance = swipeState[postId] || 0;

    // If swipe is significant, keep it open, otherwise close it
    if (swipeDistance < -50) {
      setSwipeState({
        ...swipeState,
        [postId]: -100,
      });
    } else {
      setSwipeState({
        ...swipeState,
        [postId]: 0,
      });
    }

    delete touchStartX.current[postId];
  };

  // Reset swipe state for a post
  const resetSwipe = (postId: string) => {
    setSwipeState({
      ...swipeState,
      [postId]: 0,
    });
  };

  // Handle business selection
  const handleBusinessSelect = (businessId: string) => {
    const selected = businesses.find((business) => business.id === businessId);
    if (selected) {
      setSelectedBusiness(selected);
      fetchPostsForBusiness(selected.location_id)
    }
  };

  const generateMarketingContent = async (businessId: string) => {
    try {
      setIsGenerating(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/generate`,
        {
          business_id: businessId,
        }
      );

      toast.success("Marketing content generated successfully!");
      setNewPost({
        ...newPost,
        image: {
          url: response.data.image[0]?.url,
          revised_prompt: response.data.image[0]?.revised_prompt,
        },
        content: response.data.content,
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to generate marketing content");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Render business selection UI
  const renderBusinessSelector = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Select a Business</h3>

        {/* Business Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for businesses..."
              className="pl-9"
              value={businessSearchTerm}
              onChange={(e) => setBusinessSearchTerm(e.target.value)}
            />
            {businessSearchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setBusinessSearchTerm("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Business Dropdown Selector */}
          <Select
            value={selectedBusiness?.id || ""}
            onValueChange={handleBusinessSelect}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              {filteredBusinesses.map((business) => (
                <SelectItem key={business.id} value={business.id as string}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Compact Business List */}
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">
                    Business Name
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden sm:table-cell">
                    Location
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3 w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map((business) => (
                    <tr
                      key={business.id}
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedBusiness?.id === business.id
                          ? "bg-primary/10"
                          : ""
                      )}
                      onClick={() =>
                        handleBusinessSelect(business.id as string)
                      }
                    >
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium line-clamp-1">
                            {business.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {business.location}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant={
                            selectedBusiness?.id === business.id
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          className="h-8"
                        >
                          {selectedBusiness?.id === business.id
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Building className="h-8 w-8 text-muted-foreground mb-3 opacity-20" />
                        <p className="text-muted-foreground">
                          No businesses found
                        </p>
                        {businessSearchTerm && (
                          <Button
                            variant="link"
                            onClick={() => setBusinessSearchTerm("")}
                            className="mt-1"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-muted/20 p-2 text-xs text-muted-foreground flex justify-between items-center">
            <span>{filteredBusinesses.length} businesses</span>
            {filteredBusinesses.length < businesses.length && (
              <span>Filtered from {businesses.length} total</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render no business selected message
  const renderNoBusinessSelected = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Store className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-xl font-medium mb-2">No Business Selected</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please select a business from above to view its customer reviews.
        </p>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Building className="h-4 w-4" />
          Select a Business
        </Button>
      </div>
    );
  };

  const fetchPostsForBusiness = async (location_id: string) => {
    setPosts([])
    try {
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${location_id}`
      ).then((response) => {
        setPosts(response.data)
      })
        .catch((err: string) => toast.error("Error fetching posts: " + err))
      toast.success("Posts fetched successfully!")
    } catch (error) {
      toast.error("Error fetching posts: " + error)
      return []
    }
  }

  const handleUploadPost = async () => {
    const location_id = selectedBusiness?.location_id;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/publish`,
      {
        location_id: location_id,
        post: {
          summary: newPost.content,
          media: [
            {
              sourceUrl: newPost.image.url,
              media_format: "PHOTO",
            }
          ]
        }
      }
    );
    console.log(response);
    toast.success("Post uploaded successfully!");
   
    setNewPost({
      ...newPost,
      image: {
        url: response.data.image[0]?.url,
        revised_prompt: response.data.image[0]?.revised_prompt,
      },
      content: response.data.content,
    });
    setIsComposerOpen(false);
  }

  useEffect(() => {
    if (businesses.length > 0 && businessSearchTerm) {
      const term = businessSearchTerm.toLowerCase();
      const filtered = businesses.filter(
        (business) => business.name.toLowerCase().includes(term)
      );
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses(businesses);
    }
  }, [businesses, businessSearchTerm]);

  useEffect(() => {
    const storedBusinesses = localStorage.getItem("businesses");
    if (storedBusinesses) {
      try {
        const parsedBusinesses = JSON.parse(storedBusinesses);
        setBusinesses(parsedBusinesses);
        setFilteredBusinesses(parsedBusinesses);
      } catch (error) {
        toast.error("Error parsing business data");
        console.error("Error parsing business data:", error);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Social Media</h1>
          <Button
            onClick={handleCreatePost}
            className="rounded-full h-10 px-4 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-1" />
            <span>Create Post</span>
          </Button>
        </div>

        {/* Business Selector Section */}
        {!selectedBusiness && renderNoBusinessSelected()}
        {renderBusinessSelector()}
        {/* Search and Filters */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 mt-2">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No posts found. Try adjusting your filters or create a new post.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.name}
                className="relative overflow-hidden"
                onTouchStart={(e) => handleTouchStart(e, post.name)}
                onTouchMove={(e) => handleTouchMove(e, post.name)}
                onTouchEnd={() => handleTouchEnd(post.name)}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-end h-full"
                  style={{
                    transform: `translateX(${swipeState[post.name] || 0}px)`,
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <Button
                    variant="link"
                    size="icon"
                    className="h-full rounded-none w-[50px]"
                    onClick={() => {
                      /*                     handleDeletePost(post.id); */
                      resetSwipe(post.name);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-full rounded-none w-[50px] bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      /*  handleEditPost(post); */
                      resetSwipe(post.name);
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>

                <motion.div
                  layout
                  className={`
                    border rounded-lg p-4 bg-background
                    transition-all duration-200 ease-in-out
                    ${expandedPostId === post.name
                      ? "shadow-md"
                      : "hover:shadow-sm"
                    }
                  `}
                  style={{
                    transform: `translateX(${swipeState[post.name] || 0}px)`,
                    transition: "transform 0.2s ease-out",
                  }}
                  onClick={() => togglePostExpansion(post.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(post.state)}`}>
                        {post.state.charAt(0).toUpperCase() +
                          post.state.slice(1)}
                      </Badge>
                      {post.state !== "PENDING" && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.createTime)}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            /*   handleEditPost(post); */
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            /*  handleDuplicatePost(post); */
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            /*   handleDeletePost(post.id); */
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3">
                    <p
                      className={`text-sm ${expandedPostId === post.name ? "" : "line-clamp-3"
                        }`}
                    >
                      {post.summary}
                    </p>
                  </div>

                  {post.media && post.media.length > 0 && (
                    <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
                      {post.media.map((media, index) => (
                        <div
                          key={index}
                          className="relative min-w-[100px] h-[100px] rounded-md overflow-hidden bg-muted"
                        >
                          <Image
                            src={media.googleUrl || "/placeholder.svg"}
                            alt="Media"
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex justify-center">
                    {expandedPostId === post.name ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (visible on mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          onClick={handleCreatePost}
          className="h-14 w-14 rounded-full p-0 shadow-lg"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Post</span>
        </Button>
      </div>

      {/* Post Composer Dialog */}
      <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Review and publish the AI-generated content for your business.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={
                newPost.content || ""
              }
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Generated Image</Label>
            <div className="relative w-full h-64 rounded-lg overflow-hidden border">
              {isGenerating ? (
                <div className="flex items-center justify-center w-full h-full bg-muted/30">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : newPost.image && newPost.image.url ? (
                <img
                  src={newPost.image.url}
                  alt="Generated marketing content"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted/30">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <p className="ml-2 text-sm text-muted-foreground">
                    No image available
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI-generated image based on your business profile
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadPost}>
              {newPost.status === "published"
                ? "Publish Now"
                : newPost.status === "scheduled"
                  ? "Schedule"
                  : "Save Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      {/*   <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Make changes to your post.</DialogDescription>
          </DialogHeader>

          {editingPost && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-platform">Platform</Label>
                <Select
                  value={editingPost.platform}
                  onValueChange={(value) =>
                    setEditingPost({ ...editingPost, platform: value })
                  }
                >
                  <SelectTrigger id="edit-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  placeholder="What's on your mind?"
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingPost.status}
                  onValueChange={(value) =>
                    setEditingPost({ ...editingPost, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Publish Now</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingPost.status === "scheduled" && (
                <div className="space-y-2">
                  <Label>Schedule Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex flex-wrap gap-2">
                  {editingPost.media.map((media: IMedia, index: number) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-md overflow-hidden"
                    >
                      <Image
                        src={media.url || "/placeholder.svg"}
                        alt="Media"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="link"
                        size="icon"
                        className="absolute top-1 right-1 h-5 w-5 rounded-full"
                        onClick={() => {
                          const updatedMedia = [...editingPost.media];
                          updatedMedia.splice(index, 1);
                          setEditingPost({
                            ...editingPost,
                            media: updatedMedia,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <label
                    htmlFor="edit-dropzone-file"
                    className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50"
                  >
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <input
                      id="edit-dropzone-file"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedPost}>
              {editingPost?.status === "published"
                ? "Update"
                : editingPost?.status === "scheduled"
                  ? "Schedule"
                  : "Save Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 */}
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
