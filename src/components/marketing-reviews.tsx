"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Filter,
  X,
  Sparkles,
  BarChart3,
  MessageSquare,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  sentiment: "positive" | "neutral" | "negative"
  keywords: string[]
  avatar?: string
  source?: string
  verified?: boolean
}

interface MarketingReviewsProps {
  reviews?: Review[]
  title?: string
  subtitle?: string
  className?: string
  autoplay?: boolean
  autoplaySpeed?: number
  showFilters?: boolean
  showSummary?: boolean
  showStats?: boolean
  darkMode?: boolean
}

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Their SEO services completely transformed our online presence! We've seen a 200% increase in organic traffic within just 3 months. Highly recommend their keyword strategy approach.",
    date: "2023-11-15",
    sentiment: "positive",
    keywords: ["SEO", "traffic", "keywords"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Google",
    verified: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 4,
    comment:
      "The social media marketing campaign they designed was very effective. Our engagement rates improved significantly, though I wish the reporting was a bit more detailed.",
    date: "2023-11-10",
    sentiment: "positive",
    keywords: ["social media", "engagement", "reporting"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Facebook",
    verified: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    rating: 5,
    comment:
      "Their content marketing strategy was exactly what we needed! The blog posts and infographics they created drove tons of qualified leads to our site. The ROI has been incredible.",
    date: "2023-11-05",
    sentiment: "positive",
    keywords: ["content", "leads", "ROI"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Trustpilot",
    verified: true,
  },
  {
    id: "4",
    name: "David Wilson",
    rating: 3,
    comment:
      "The PPC campaign had mixed results. While we did see some conversion improvements, the ad spend was higher than initially discussed. Their customer service was responsive when addressing our concerns.",
    date: "2023-10-28",
    sentiment: "neutral",
    keywords: ["PPC", "conversions", "ad spend"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Yelp",
    verified: false,
  },
  {
    id: "5",
    name: "Jessica Taylor",
    rating: 2,
    comment:
      "Disappointed with their email marketing services. The open rates were below industry average and we didn't see the results promised. The campaign lacked creativity and personalization.",
    date: "2023-10-20",
    sentiment: "negative",
    keywords: ["email", "open rates", "personalization"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "WordPress",
    verified: true,
  },
  {
    id: "6",
    name: "Robert Brown",
    rating: 5,
    comment:
      "The website redesign completely transformed our brand image! The UX improvements led to a 45% increase in time-on-site and a 30% decrease in bounce rate. Excellent work!",
    date: "2023-10-15",
    sentiment: "positive",
    keywords: ["website", "UX", "bounce rate"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Google",
    verified: true,
  },
  {
    id: "7",
    name: "Amanda Lee",
    rating: 4,
    comment:
      "Their local SEO strategy helped our small business appear in the Google 3-pack within weeks! Phone calls and in-store visits have increased noticeably since we started working with them.",
    date: "2023-10-10",
    sentiment: "positive",
    keywords: ["local SEO", "Google", "visits"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "WordPress",
    verified: true,
  },
  {
    id: "8",
    name: "Thomas Garcia",
    rating: 1,
    comment:
      "Very disappointed with their analytics reporting. The data was often inaccurate and the insights were generic at best. Wouldn't recommend their data services to anyone serious about marketing.",
    date: "2023-10-05",
    sentiment: "negative",
    keywords: ["analytics", "data", "reporting"],
    avatar: "/placeholder.svg?height=40&width=40",
    source: "Trustpilot",
    verified: false,
  },
]

// Mock AI-generated summaries based on sentiment distribution
const generateAISummary = (reviews: Review[]) => {
  const positiveCount = reviews.filter((r) => r.sentiment === "positive").length

  const totalReviews = reviews.length
  const positivePercentage = Math.round((positiveCount / totalReviews) * 100)

  // Extract common keywords from positive reviews
  const positiveReviews = reviews.filter((r) => r.sentiment === "positive")
  const allKeywords = positiveReviews.flatMap((r) => r.keywords)
  const keywordCounts: Record<string, number> = {}

  allKeywords.forEach((keyword) => {
    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
  })

  // Find the most common keyword
  let topKeyword = ""
  let maxCount = 0

  Object.entries(keywordCounts).forEach(([keyword, count]) => {
    if (count > maxCount) {
      maxCount = count
      topKeyword = keyword
    }
  })

  // Generate summary based on sentiment distribution
  if (positivePercentage >= 80) {
    return `Customers love our ${topKeyword || "marketing"} services! ${positivePercentage}% of reviews are overwhelmingly positive. ✨`
  } else if (positivePercentage >= 60) {
    return `Our ${topKeyword || "marketing"} services are highly rated with ${positivePercentage}% positive feedback. 🚀`
  } else if (positivePercentage >= 40) {
    return `Mixed feedback on our services with ${positivePercentage}% positive reviews. We're constantly improving! 📈`
  } else {
    return `We're working hard to improve our ${topKeyword || "marketing"} services based on your valuable feedback. 🔄`
  }
}

// Calculate average rating
const calculateAverageRating = (reviews: Review[]) => {
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

// Rating distribution
const calculateRatingDistribution = (reviews: Review[]) => {
  const distribution = [0, 0, 0, 0, 0]

  reviews.forEach((review) => {
    distribution[review.rating - 1]++
  })

  return distribution.map((count) => (count / reviews.length) * 100)
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

export function MarketingReviews({
  reviews = mockReviews,
  title = "Customer Reviews",
  subtitle = "See what our clients say about our marketing services",
  className = "",
  autoplay = true,
  autoplaySpeed = 5000,
  showFilters = true,
  showSummary = true,
  showStats = true,
  darkMode = false,
}: MarketingReviewsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [keywordFilter, setKeywordFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"carousel" | "grid" | "list">("carousel")
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)

  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Extract all unique keywords from reviews
  const allKeywords = Array.from(new Set(reviews.flatMap((review) => review.keywords)))

  // Apply filters
  useEffect(() => {
    let result = [...reviews]

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (review) =>
          review.comment.toLowerCase().includes(term) ||
          review.name.toLowerCase().includes(term) ||
          review.keywords.some((keyword) => keyword.toLowerCase().includes(term)),
      )
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = Number.parseInt(ratingFilter)
      result = result.filter((review) => review.rating >= minRating)
    }

    // Sentiment filter
    if (sentimentFilter !== "all") {
      result = result.filter((review) => review.sentiment === sentimentFilter)
    }

    // Keyword filter
    if (keywordFilter !== "all") {
      result = result.filter((review) =>
        review.keywords.some((keyword) => keyword.toLowerCase() === keywordFilter.toLowerCase()),
      )
    }

    setFilteredReviews(result)

    // Reset active index when filters change
    setActiveIndex(0)
  }, [reviews, searchTerm, ratingFilter, sentimentFilter, keywordFilter])

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isAutoplayPaused && viewMode === "carousel") {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex === filteredReviews.length - 1 ? 0 : prevIndex + 1))
      }, autoplaySpeed)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, autoplaySpeed, filteredReviews.length, isAutoplayPaused, viewMode])

  // Handle next/prev navigation
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? filteredReviews.length - 1 : prevIndex - 1))

    // Pause autoplay temporarily when manually navigating
    setIsAutoplayPaused(true)
    setTimeout(() => setIsAutoplayPaused(false), 10000)
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === filteredReviews.length - 1 ? 0 : prevIndex + 1))

    // Pause autoplay temporarily when manually navigating
    setIsAutoplayPaused(true)
    setTimeout(() => setIsAutoplayPaused(false), 10000)
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4 mr-0.5",
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600",
            )}
          />
        ))}
      </div>
    )
  }

  // Render sentiment icon
  const renderSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            Positive
          </Badge>
        )
      case "neutral":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          >
            <Meh className="h-3 w-3 mr-1" />
            Neutral
          </Badge>
        )
      case "negative":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
          >
            <ThumbsDown className="h-3 w-3 mr-1" />
            Negative
          </Badge>
        )
      default:
        return null
    }
  }

  // Render review card
  const renderReviewCard = (review: Review, index: number, isActive = false) => {
    return (
      <Card
        className={cn(
          "h-full transition-all duration-300 overflow-hidden",
          isActive ? "border-primary/50 shadow-md" : "border-border",
          darkMode ? "bg-card dark" : "bg-card",
        )}
      >
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              {review.avatar ? (
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-border">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary font-medium">
                  {review.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{review.name}</p>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  {review.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="ml-2 h-5 px-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            ✓
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified Review</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {renderSentimentIcon(review.sentiment)}
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(review.date)}
              </div>
            </div>
          </div>

          <p className="text-sm mb-3 flex-grow">{review.comment}</p>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-1 mt-2">
              {review.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => setKeywordFilter(keyword)}
                >
                  #{keyword}
                </Badge>
              ))}
            </div>

            {review.source && (
              <div className="flex justify-end mt-2">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  via {review.source}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render carousel view
  const renderCarouselView = () => {
    return (
      <div className="relative">
        <div className="overflow-hidden relative min-h-[280px] sm:min-h-[250px]">
          <AnimatePresence mode="wait">
            {filteredReviews.length > 0 ? (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderReviewCard(filteredReviews[activeIndex], activeIndex, true)}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[250px]"
              >
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">No reviews match your filters</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("")
                    setRatingFilter("all")
                    setSentimentFilter("all")
                    setKeywordFilter("all")
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredReviews.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous review</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next review</span>
            </Button>

            <div className="flex justify-center mt-4 gap-1">
              {filteredReviews.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/30",
                  )}
                  onClick={() => {
                    setActiveIndex(index)
                    setIsAutoplayPaused(true)
                    setTimeout(() => setIsAutoplayPaused(false), 10000)
                  }}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {renderReviewCard(review, index)}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">No reviews match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setRatingFilter("all")
                setSentimentFilter("all")
                setKeywordFilter("all")
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Render list view
  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {renderReviewCard(review, index)}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">No reviews match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setRatingFilter("all")
                setSentimentFilter("all")
                setKeywordFilter("all")
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Render stats section
  const renderStats = () => {
    const averageRating = calculateAverageRating(reviews)
    const distribution = calculateRatingDistribution(reviews)

    return (
      <Card className={cn("mb-6", darkMode ? "bg-card dark" : "bg-card")}>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Rating</h3>
              <div className="flex items-center">
                <span className="text-4xl font-bold mr-2">{averageRating}</span>
                <div className="flex flex-col">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          Number.parseFloat(averageRating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : Number.parseFloat(averageRating) >= star - 0.5
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-300 dark:text-gray-600",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                  <div key={rating} className="flex items-center">
                    <div className="w-8 text-sm text-right mr-2">{rating} ★</div>
                    <Progress value={distribution[4 - index]} className="h-2 flex-grow" />
                    <div className="w-12 text-xs text-muted-foreground text-right ml-2">
                      {Math.round(distribution[4 - index])}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Sentiment Analysis</h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">{reviews.filter((r) => r.sentiment === "positive").length}</span>
                <span className="text-xs text-muted-foreground">Positive</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <Meh className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">{reviews.filter((r) => r.sentiment === "neutral").length}</span>
                <span className="text-xs text-muted-foreground">Neutral</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                  <ThumbsDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium">{reviews.filter((r) => r.sentiment === "negative").length}</span>
                <span className="text-xs text-muted-foreground">Negative</span>
              </div>

              <div className="flex flex-col items-center ml-auto">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{allKeywords.length}</span>
                <span className="text-xs text-muted-foreground">Keywords</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full", className, darkMode ? "dark" : "")}>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {/* View Mode Selector */}
          <Tabs
            defaultValue="carousel"
            className="w-auto"
            onValueChange={(value) => setViewMode(value as "carousel" | "grid" | "list")}
          >
            <TabsList className="grid w-[180px] grid-cols-3">
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* AI-generated Summary */}
        {showSummary && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 opacity-10">
              <Sparkles className="h-full w-full text-primary" />
            </div>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  AI-Generated Insight
                  <Badge variant="outline" className="ml-2 text-xs">
                    <RefreshCw className="h-2.5 w-2.5 mr-1" />
                    Updated today
                  </Badge>
                </h3>
                <p className="text-sm mt-1">{generateAISummary(reviews)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {showStats && renderStats()}

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars & Up</SelectItem>
                  <SelectItem value="4">4 Stars & Up</SelectItem>
                  <SelectItem value="3">3 Stars & Up</SelectItem>
                  <SelectItem value="2">2 Stars & Up</SelectItem>
                  <SelectItem value="1">1 Star & Up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiment</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keyword Filter */}
          {allKeywords.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by keyword:</span>
                {keywordFilter !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 ml-2 text-xs"
                    onClick={() => setKeywordFilter("all")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant={keywordFilter === keyword ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setKeywordFilter(keyword === keywordFilter ? "all" : keyword)}
                  >
                    #{keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {(searchTerm || ratingFilter !== "all" || sentimentFilter !== "all" || keywordFilter !== "all") && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                Showing {filteredReviews.length} of {reviews.length} reviews
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-6 ml-2 text-xs"
                onClick={() => {
                  setSearchTerm("")
                  setRatingFilter("all")
                  setSentimentFilter("all")
                  setKeywordFilter("all")
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          <Separator />
        </div>
      )}

      {/* Reviews Display */}
      <div className="mb-6">
        {viewMode === "carousel" && renderCarouselView()}
        {viewMode === "grid" && renderGridView()}
        {viewMode === "list" && renderListView()}
      </div>
    </div>
  )
}

export default MarketingReviews

