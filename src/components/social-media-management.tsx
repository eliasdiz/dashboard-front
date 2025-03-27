"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Edit,
  Facebook,
  Filter,
  Heart,
  ImageIcon,
  Instagram,
  Linkedin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  Trash2,
  Twitter,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import Image from "next/image"

interface IMedia {
    type: string
    url: string
}

interface IEngagement { 
    likes: number 
    comments: number
    shares: number 
}

interface IPosts {
    id: string
    content: string
    status: string
    platform: string
    date: string
    engagement: IEngagement
    media: IMedia[]
}

// Sample data for social media posts
const initialPosts: IPosts[] = [
  {
    id: "post-1",
    content:
      "Excited to announce our new product line launching next week! Stay tuned for exclusive deals and promotions. #NewProduct #ComingSoon",
    status: "published",
    platform: "twitter",
    date: "2023-03-15T10:30:00",
    engagement: {
      likes: 245,
      comments: 37,
      shares: 89,
    },
    media: [
      {
        type: "image",
        url: "/social-media.jpg",
      },
    ],
  },
  {
    id: "post-2",
    content:
      "Check out our latest case study on how we helped a client increase their conversion rate by 150% in just 3 months!",
    status: "scheduled",
    platform: "linkedin",
    date: "2023-03-20T14:00:00",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    media: [],
  },
  {
    id: "post-3",
    content:
      "Behind the scenes at our annual team retreat. Building connections and creating memories! #TeamBuilding #CompanyCulture",
    status: "published",
    platform: "instagram",
    date: "2023-03-10T16:45:00",
    engagement: {
      likes: 532,
      comments: 48,
      shares: 12,
    },
    media: [
      {
        type: "image",
        url: "/social-media.jpg",
      },
      {
        type: "image",
        url: "/social-media.jpg",
      },
    ],
  },
  {
    id: "post-4",
    content:
      "We're hiring! Join our growing team of passionate professionals. Check out our careers page for open positions.",
    status: "draft",
    platform: "facebook",
    date: "",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    media: [],
  },
  {
    id: "post-5",
    content:
      "Tips for optimizing your website performance and improving user experience. Read our latest blog post to learn more!",
    status: "scheduled",
    platform: "twitter",
    date: "2023-03-25T09:15:00",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    media: [],
  },
  {
    id: "post-6",
    content:
      "Happy to share that we've been recognized as a top agency in our industry for the third consecutive year! Thank you to our amazing clients and team for making this possible.",
    status: "published",
    platform: "linkedin",
    date: "2023-03-05T11:20:00",
    engagement: {
      likes: 423,
      comments: 56,
      shares: 78,
    },
    media: [],
  },
  {
    id: "post-7",
    content: "New blog post: '10 Strategies to Boost Your Social Media Engagement'. Link in bio!",
    status: "draft",
    platform: "instagram",
    date: "",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    media: [
      {
        type: "image",
        url: "/social-media.jpg",
      },
    ],
  },
]

export function SocialMediaManagement() {
  const [posts, setPosts] = useState(initialPosts)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    id: "",
    content: "",
    status: "draft",
    platform: "",
    date: "",
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    media: [],
  })
  const [editingPost, setEditingPost] = useState<IPosts | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [swipeState, setSwipeState] = useState<{ [key: string]: number }>({})

  const touchStartX = useRef<{ [key: string]: number }>({})

  // Filter posts based on search term, status, and platform
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesPlatform = platformFilter === "all" || post.platform === platformFilter

    return matchesSearch && matchesStatus && matchesPlatform
  })

  // Handle post expansion
  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId)
  }

  // Handle creating a new post
  const handleCreatePost = () => {
    setNewPost({
      id: "",
      content: "",
      status: "draft",
      platform: "",
      date: "",
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      media: [],
    })
    setIsComposerOpen(true)
  }

  // Handle saving a new post
  const handleSaveNewPost = () => {
    if (newPost.content.trim() === "" || newPost.platform === "") return

    const postId = `post-${Date.now()}`
    const postToAdd = {
      ...newPost,
      id: postId,
    }

    setPosts([postToAdd, ...posts])
    setIsComposerOpen(false)
  }

  // Handle editing a post
  const handleEditPost = (post: IPosts) => {
    setEditingPost({ ...post })
    setDate(post.date ? parseISO(post.date) : undefined)
  }

  // Handle saving edited post
  const handleSaveEditedPost = () => {
    if (!editingPost) return

    const updatedPost = {
      ...editingPost,
      date: date ? date.toISOString() : "",
    }

    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
    setEditingPost(null)
  }

  // Handle deleting a post
  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId)
    setDeleteConfirmOpen(true)
  }

  // Confirm delete post
  const confirmDeletePost = () => {
    if (!postToDelete) return

    setPosts(posts.filter((post) => post.id !== postToDelete))
    setDeleteConfirmOpen(false)
    setPostToDelete(null)
    if (expandedPostId === postToDelete) {
      setExpandedPostId(null)
    }
  }

  // Handle duplicating a post
  const handleDuplicatePost = (post: IPosts) => {
    const duplicatedPost = {
      ...post,
      id: `post-${Date.now()}`,
      status: "draft",
      date: "",
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
    }

    setPosts([duplicatedPost, ...posts])
  }

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      default:
        return null
    }
  }

  // Get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "text-blue-400"
      case "facebook":
        return "text-blue-600"
      case "instagram":
        return "text-pink-500"
      case "linkedin":
        return "text-blue-700"
      default:
        return ""
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      default:
        return ""
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a")
  }

  // Handle touch start for swipe gestures
  const handleTouchStart = (e: React.TouchEvent, postId: string) => {
    touchStartX.current[postId] = e.touches[0].clientX
  }

  // Handle touch move for swipe gestures
  const handleTouchMove = (e: React.TouchEvent, postId: string) => {
    if (!touchStartX.current[postId]) return

    const touchX = e.touches[0].clientX
    const diff = touchStartX.current[postId] - touchX

    // Limit swipe to left and to a maximum distance
    if (diff > 0 && diff < 100) {
      setSwipeState({
        ...swipeState,
        [postId]: -diff,
      })
    }
  }

  // Handle touch end for swipe gestures
  const handleTouchEnd = (postId: string) => {
    const swipeDistance = swipeState[postId] || 0

    // If swipe is significant, keep it open, otherwise close it
    if (swipeDistance < -50) {
      setSwipeState({
        ...swipeState,
        [postId]: -100,
      })
    } else {
      setSwipeState({
        ...swipeState,
        [postId]: 0,
      })
    }

    delete touchStartX.current[postId]
  }

  // Reset swipe state for a post
  const resetSwipe = (postId: string) => {
    setSwipeState({
      ...swipeState,
      [postId]: 0,
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Social Media</h1>
          <Button onClick={handleCreatePost} className="rounded-full h-10 px-4 bg-primary hover:bg-primary/90">
            <Plus className="h-5 w-5 mr-1" />
            <span>Create Post</span>
          </Button>
        </div>

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
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No posts found. Try adjusting your filters or create a new post.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="relative overflow-hidden"
                onTouchStart={(e) => handleTouchStart(e, post.id)}
                onTouchMove={(e) => handleTouchMove(e, post.id)}
                onTouchEnd={() => handleTouchEnd(post.id)}
              >
                {/* Swipe Actions (Mobile) */}
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-end h-full"
                  style={{
                    transform: `translateX(${swipeState[post.id] || 0}px)`,
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <Button
                    variant="link"
                    size="icon"
                    className="h-full rounded-none w-[50px]"
                    onClick={() => {
                      handleDeletePost(post.id)
                      resetSwipe(post.id)
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-full rounded-none w-[50px] bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      handleEditPost(post)
                      resetSwipe(post.id)
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Block */}
                <motion.div
                  layout
                  className={`
                    border rounded-lg p-4 bg-background
                    transition-all duration-200 ease-in-out
                    ${expandedPostId === post.id ? "shadow-md" : "hover:shadow-sm"}
                  `}
                  style={{
                    transform: `translateX(${swipeState[post.id] || 0}px)`,
                    transition: "transform 0.2s ease-out",
                  }}
                  onClick={() => togglePostExpansion(post.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`${getPlatformColor(post.platform)}`}>{getPlatformIcon(post.platform)}</div>
                      <Badge className={`${getStatusColor(post.status)}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                      {post.status !== "draft" && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.date)}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditPost(post)
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicatePost(post)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePost(post.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3">
                    <p className={`text-sm ${expandedPostId === post.id ? "" : "line-clamp-3"}`}>{post.content}</p>
                  </div>

                  {/* Media Preview */}
                  {post.media.length > 0 && (
                    <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
                      {post.media.map((media, index) => (
                        <div
                          key={index}
                          className="relative min-w-[100px] h-[100px] rounded-md overflow-hidden bg-muted"
                        >
                          <Image
                            src={media.url || "/placeholder.svg"}
                            alt="Media"
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Engagement Metrics (only for published posts) */}
                  {post.status === "published" && (
                    <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                        {post.engagement.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                        {post.engagement.comments}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1 text-green-500" />
                        {post.engagement.shares}
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Indicator */}
                  <div className="mt-2 flex justify-center">
                    {expandedPostId === post.id ? (
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
        <Button onClick={handleCreatePost} className="h-14 w-14 rounded-full p-0 shadow-lg">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Post</span>
        </Button>
      </div>

      {/* Post Composer Dialog */}
      <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Compose your post and select where to publish it.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={newPost.platform} onValueChange={(value) => setNewPost({ ...newPost, platform: value })}>
                <SelectTrigger id="platform">
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newPost.status} onValueChange={(value) => setNewPost({ ...newPost, status: value })}>
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

            {newPost.status === "scheduled" && (
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label>Media</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewPost}>
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
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
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
                  onValueChange={(value) => setEditingPost({ ...editingPost, platform: value })}
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
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingPost.status}
                  onValueChange={(value) => setEditingPost({ ...editingPost, status: value })}
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
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex flex-wrap gap-2">
                  {editingPost.media.map((media: IMedia, index: number) => (
                    <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image src={media.url || "/placeholder.svg"} alt="Media" width={300} height={300} className="w-full h-full object-cover" />
                      <Button
                        variant="link"
                        size="icon"
                        className="absolute top-1 right-1 h-5 w-5 rounded-full"
                        onClick={() => {
                          const updatedMedia = [...editingPost.media]
                          updatedMedia.splice(index, 1)
                          setEditingPost({ ...editingPost, media: updatedMedia })
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
                    <input id="edit-dropzone-file" type="file" className="hidden" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

