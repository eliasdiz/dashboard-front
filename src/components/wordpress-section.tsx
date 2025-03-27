"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TagIcon,
  FolderIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  SearchIcon,
  ExternalLinkIcon,
  ClockIcon,
  UserIcon,
  LayoutGridIcon,
  ListIcon,
} from "lucide-react"
import { format } from "date-fns"

// Types for WordPress content
interface WordPressPost {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  link: string
  featured_media: number
  _embedded?: {
    author?: Array<{ name: string; avatar_urls?: { 96: string } }>
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>
  }
  categories?: number[]
  tags?: number[]
}

interface WordPressPage {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  date: string
  link: string
  featured_media: number
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>
  }
}

interface WordPressCategory {
  id: number
  name: string
  slug: string
  count: number
}

interface WordPressTag {
  id: number
  name: string
  slug: string
  count: number
}

interface WordPressSectionProps {
  apiUrl: string
  defaultSectionType?: "posts" | "pages" | "custom"
  defaultLayout?: "grid" | "list"
  title?: string
  description?: string
  limit?: number
  showFilters?: boolean
  customEndpoint?: string
  refreshInterval?: number // in milliseconds, for auto-refresh
  className?: string
}

export default function WordPressSection({
  apiUrl,
  defaultSectionType = "posts",
  defaultLayout = "grid",
  title = "WordPress Content",
  description = "Dynamically loaded content from WordPress",
  limit = 6,
  showFilters = true,
  customEndpoint = "",
  refreshInterval = 0,
  className = "",
}: WordPressSectionProps) {
  // State for content and UI
  const [content, setContent] = useState<WordPressPost[] | WordPressPage[]>([])
  const [categories, setCategories] = useState<WordPressCategory[]>([])
  const [tags, setTags] = useState<WordPressTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sectionType, setSectionType] = useState<"posts" | "pages" | "custom">(defaultSectionType)
  const [layout, setLayout] = useState<"grid" | "list">(defaultLayout)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Function to build the API URL based on section type and filters
  const buildApiUrl = () => {
    let endpoint = ""

    switch (sectionType) {
      case "posts":
        endpoint = `${apiUrl}/wp-json/wp/v2/posts?_embed&per_page=${limit}&page=${page}`
        break
      case "pages":
        endpoint = `${apiUrl}/wp-json/wp/v2/pages?_embed&per_page=${limit}&page=${page}`
        break
      case "custom":
        endpoint = customEndpoint
          ? `${apiUrl}${customEndpoint}`
          : `${apiUrl}/wp-json/wp/v2/posts?_embed&per_page=${limit}&page=${page}`
        break
      default:
        endpoint = `${apiUrl}/wp-json/wp/v2/posts?_embed&per_page=${limit}&page=${page}`
    }

    // Add filters if applicable
    if (sectionType === "posts") {
      if (selectedCategory !== "all") {
        endpoint += `&categories=${selectedCategory}`
      }

      if (selectedTag !== "all") {
        endpoint += `&tags=${selectedTag}`
      }

      if (searchQuery) {
        endpoint += `&search=${encodeURIComponent(searchQuery)}`
      }

      if (dateFilter !== "all") {
        const now = new Date()
        let after

        switch (dateFilter) {
          case "day":
            after = new Date(now.setDate(now.getDate() - 1)).toISOString()
            break
          case "week":
            after = new Date(now.setDate(now.getDate() - 7)).toISOString()
            break
          case "month":
            after = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
            break
          case "year":
            after = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
            break
        }

        if (after) {
          endpoint += `&after=${after}`
        }
      }
    }

    return endpoint
  }

  // Function to fetch WordPress content
  const fetchContent = async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = buildApiUrl()
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setContent(data)

      // Get total pages from headers
      const totalPagesHeader = response.headers.get("X-WP-TotalPages")
      setTotalPages(totalPagesHeader ? Number.parseInt(totalPagesHeader) : 1)
    } catch (err) {
      console.error("Error fetching WordPress content:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch categories and tags for filters
  const fetchTaxonomies = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch(`${apiUrl}/wp-json/wp/v2/categories?per_page=100`)
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }

      // Fetch tags
      const tagsResponse = await fetch(`${apiUrl}/wp-json/wp/v2/tags?per_page=100`)
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        setTags(tagsData)
      }
    } catch (err) {
      console.error("Error fetching taxonomies:", err)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchContent()
    if (showFilters) {
      fetchTaxonomies()
    }

    // Set up auto-refresh if interval is provided
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchContent, refreshInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  })

  // Fetch content when filters or pagination changes
  useEffect(() => {
    fetchContent()
  })

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedTag, searchQuery, dateFilter, sectionType])

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Render loading state
  if (loading && content.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircleIcon className="mr-2 h-5 w-5" />
            Error Loading WordPress Content
          </CardTitle>
          <CardDescription>We encountered a problem while fetching content from WordPress.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            <p className="font-medium">Error details:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button variant="outline" className="mt-4" onClick={fetchContent}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue={sectionType}
              onValueChange={(value) => setSectionType(value as "posts" | "pages" | "custom")}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex space-x-1 border rounded-md">
              <Button
                variant={layout === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setLayout("grid")}
              >
                <LayoutGridIcon className="h-4 w-4" />
                <span className="sr-only">Grid layout</span>
              </Button>
              <Button
                variant={layout === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setLayout("list")}
              >
                <ListIcon className="h-4 w-4" />
                <span className="sr-only">List layout</span>
              </Button>
            </div>

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={fetchContent}>
              <RefreshCwIcon className="h-4 w-4" />
              <span className="sr-only">Refresh content</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && sectionType === "posts" && (
        <CardContent className="border-b pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="text-sm font-medium mb-1 block">
                Search
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-medium mb-1 block">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="tag" className="text-sm font-medium mb-1 block">
                Tag
              </label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger id="tag" className="w-full">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      {tag.name} ({tag.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="date" className="text-sm font-medium mb-1 block">
                Date
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date" className="w-full">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}

      <CardContent className="pt-6">
        {content.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted inline-flex rounded-full p-3 mb-4">
              <FolderIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No content found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedTag("all")
                setSearchQuery("")
                setDateFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {content.map((item) => {
                const post = item as WordPressPost
                const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]
                const author = post._embedded?.author?.[0]
                const categories = post._embedded?.["wp:term"]?.[0] || []
                const tags = post._embedded?.["wp:term"]?.[1] || []

                return (
                  <Card
                    key={post.id}
                    className={`overflow-hidden ${layout === "list" ? "flex flex-col md:flex-row" : ""}`}
                  >
                    {featuredMedia && (
                      <div className={`${layout === "list" ? "md:w-1/3" : "w-full"} relative`}>
                        <div className="aspect-video w-full bg-muted overflow-hidden">
                          {/* eslint-disable @next/next/no-img-element */}
                          <img
                            src={featuredMedia.source_url || "/placeholder.svg?height=200&width=300"}
                            alt={featuredMedia.alt_text || post.title.rendered}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                          {/* eslint-enable @next/next/no-img-element */}
                        </div>
                      </div>
                    )}

                    <div className={`${layout === "list" ? "md:w-2/3" : "w-full"}`}>
                      <CardHeader className={`${layout === "list" ? "p-4 md:p-6" : "p-4"}`}>
                        <div className="space-y-1">
                          {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {categories.slice(0, 2).map((category) => (
                                <Badge key={category.id} variant="secondary" className="text-xs">
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <CardTitle className="text-lg leading-tight line-clamp-2">{post.title.rendered}</CardTitle>

                          {author && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {/* eslint-disable @next/next/no-img-element */}
                              {author.avatar_urls?.["96"] ? (
                                <img
                                  src={author.avatar_urls["96"] || "/placeholder.svg"}
                                  alt={author.name}
                                  className="w-5 h-5 rounded-full"
                                />
                                
                              ) : (
                                <UserIcon className="w-4 h-4" />
                              )}
                              <span>{author.name}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="flex items-center">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                {format(new Date(post.date), "MMM d, yyyy")}
                              </span>
                              {/* eslint-enable @next/next/no-img-element */}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className={`${layout === "list" ? "p-4 md:px-6 md:pt-0" : "p-4 pt-0"}`}>
                        <div
                          className="text-sm text-muted-foreground line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt?.rendered || truncateText(stripHtml(post.content.rendered), 150),
                          }}
                        />
                      </CardContent>

                      <CardFooter
                        className={`${layout === "list" ? "p-4 md:px-6 pt-0" : "p-4 pt-0"} flex justify-between items-center`}
                      >
                        <Button variant="outline" size="sm" asChild>
                          <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Read More
                            <ExternalLinkIcon className="ml-1 h-3 w-3" />
                          </a>
                        </Button>

                        {tags.length > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <TagIcon className="mr-1 h-3 w-3" />
                            <span className="hidden sm:inline">{tags[0].name}</span>
                            {tags.length > 1 && <span className="hidden sm:inline">, ...</span>}
                          </div>
                        )}
                      </CardFooter>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing page {page} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Calculate page numbers to show (centered around current page)
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }

                      return (
                        <Button
                          key={i}
                          variant={pageNum === page ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8 mx-0.5"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

