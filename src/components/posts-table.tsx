"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp, Edit, Eye, MoreHorizontal, Search, Trash } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for posts
const samplePosts = [
  {
    id: "post-001",
    title: "10 Tips for Better SEO Rankings",
    status: "published",
    author: "John Smith",
    date: "2023-11-15",
    category: "SEO",
    views: 1245,
  },
  {
    id: "post-002",
    title: "How to Optimize Your Google Business Profile",
    status: "published",
    author: "Sarah Johnson",
    date: "2023-11-10",
    category: "Local SEO",
    views: 987,
  },
  {
    id: "post-003",
    title: "Understanding Google's Latest Algorithm Update",
    status: "draft",
    author: "Michael Brown",
    date: "2023-11-05",
    category: "SEO",
    views: 0,
  },
  {
    id: "post-004",
    title: "Social Media Marketing Strategies for 2024",
    status: "scheduled",
    author: "Emily Davis",
    date: "2023-12-01",
    category: "Social Media",
    views: 0,
  },
  {
    id: "post-005",
    title: "The Ultimate Guide to Content Marketing",
    status: "published",
    author: "John Smith",
    date: "2023-10-28",
    category: "Content",
    views: 2156,
  },
  {
    id: "post-006",
    title: "Email Marketing Best Practices",
    status: "draft",
    author: "Sarah Johnson",
    date: "2023-10-20",
    category: "Email",
    views: 0,
  },
  {
    id: "post-007",
    title: "How to Increase Your Website Conversion Rate",
    status: "published",
    author: "Michael Brown",
    date: "2023-10-15",
    category: "Conversion",
    views: 1532,
  },
]

export function PostsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"title" | "date" | "views">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter posts based on search term
  const filteredPosts = samplePosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort posts based on sort field and direction
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortField === "title") {
      const aValue = a.title.toLowerCase()
      const bValue = b.title.toLowerCase()
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else if (sortField === "date") {
      const aValue = new Date(a.date).getTime()
      const bValue = new Date(b.date).getTime()
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    } else {
      // views
      return sortDirection === "asc" ? a.views - b.views : b.views - a.views
    }
  })

  // Handle sort click
  const handleSort = (field: "title" | "date" | "views") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground">Published</Badge>
      case "draft":
        return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-secondary text-secondary-foreground">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts</CardTitle>
        <CardDescription>Manage your blog posts and content</CardDescription>
        <div className="flex items-center mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="ml-4 bg-primary hover:bg-primary/90 text-white">
            Create Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                  <div className="flex items-center">
                    Title
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("views")}>
                  <div className="flex items-center">
                    Views
                    {sortField === "views" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(post.date)}
                      </div>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <div className="flex items-center">
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                          {post.views.toLocaleString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit post
                          </DropdownMenuItem>
                          {post.status === "published" && (
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View post
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
