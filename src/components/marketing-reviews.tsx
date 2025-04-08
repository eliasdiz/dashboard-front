"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Sparkles,
  MessageSquare,
  Calendar,
  RefreshCw,
  Building,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import GoogleLoader from "./google-loader"
import axios from "axios"
import { Review } from "@/types/types"
import { toast } from "react-toastify";

interface Business {
  id: string;
  name: string;
  services: string[];
  location: string;
  phone: string[];
  website: string;
  location_id: string;
  user_params: {
    keywords: string;
    amount_words: string;
  };
  social_tags: string[];
  target_locations: string[];
}

interface MarketingReviewsProps {
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
  title = "Customer Reviews",
  subtitle = "See what our clients say about our marketing services",
  className = "",
  autoplay = true,
  autoplaySpeed = 5000,
  showFilters = true,
  darkMode = false,
}: MarketingReviewsProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews)
  const [businessSearchTerm, setBusinessSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [keywordFilter, setKeywordFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"carousel" | "grid" | "list">("carousel")
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Load businesses from localStorage on component mount
  useEffect(() => {
    const storedBusinesses = localStorage.getItem('businesses')
    console.log("Stored Businesses:", storedBusinesses)
    if (storedBusinesses) {
      try {
        const parsedBusinesses = JSON.parse(storedBusinesses)
        setBusinesses(parsedBusinesses)
        setFilteredBusinesses(parsedBusinesses)
      } catch (error) {
        toast.error("Error parsing business data")
        console.error("Error parsing business data:", error)
      }
    }
  }, [])

  // Filter businesses based on search term
  useEffect(() => {
    if (businesses.length > 0 && businessSearchTerm) {
      const term = businessSearchTerm.toLowerCase()
      const filtered = businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(term)/*  ||
          business.location.toLowerCase().includes(term) ||
          business.services.some((service) => service.toLowerCase().includes(term)) */
      )
      setFilteredBusinesses(filtered)
    } else {
      setFilteredBusinesses(businesses)
    }
  }, [businesses, businessSearchTerm])

  // Handle business selection
  const handleBusinessSelect = (businessId: string) => {
    const selected = businesses.find(business => business.id === businessId)
    if (selected) {
      setSelectedBusiness(selected)
      fetchReviewsForBusiness(selected.id)
    }
  }

  // Fetch reviews for selected business
  const fetchReviewsForBusiness = (businessId: string) => {
    setLoading(true)
    setReviews([])
    setFilteredReviews([])

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${businessId}`
      )
      .then((response) => {
        const formattedReviews = response.data?.reviews?.map(
          (review: Review) => ({
            ...review
          })
        )
        setReviews(formattedReviews)
        setFilteredReviews(formattedReviews)
        localStorage.setItem(
          `reviews_${businessId}`,
          JSON.stringify(formattedReviews)
        )
      })
      .catch((err: string) => toast.error("Error fetching reviews: " + err))
      .finally(() => setLoading(false))
  }

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

  const renderStars = (rating: string) => {
    enum StarRating {
      ONE = 1,
      TWO = 2,
      THREE = 3,
      FOUR = 4,
      FIVE = 5,
    }

    const starValue = StarRating[rating as keyof typeof StarRating] || 0;

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4 mr-0.5",
              star <= starValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

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
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-border">
                {review.reviewer?.profilePhotoUrl ? (
                  <Image
                    src={review.reviewer.profilePhotoUrl}
                    alt={review.reviewer.displayName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {review.reviewer?.displayName?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium text-sm">{review.reviewer?.displayName}</p>
                <div className="flex items-center">
                  {renderStars(review.starRating)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(review.createTime)}
              </div>
            </div>
          </div>

          <p className="text-sm mb-3 flex-grow">{review.comment}</p>
          {review.reviewReply?.comment && (
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
                  <p className="text-sm mt-1">{review.reviewReply.comment}</p>
                </div>
              </div>
            </div>
          )}
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
              key={review.reviewId}
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
              key={review.reviewId}
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

  // Apply filters
  useEffect(() => {
    if (reviews.length > 0) {
      let result = [...reviews]

      // Rating filter
      if (ratingFilter !== "all") {
        const ratingValue = parseInt(ratingFilter)
        result = result.filter((review) => {
          const reviewRating = review.starRating === "ONE" ? 1 :
            review.starRating === "TWO" ? 2 :
              review.starRating === "THREE" ? 3 :
                review.starRating === "FOUR" ? 4 :
                  review.starRating === "FIVE" ? 5 : 0
          return reviewRating >= ratingValue
        })
      }

      // Sentiment filter (would need to be implemented based on your sentiment data)
      if (sentimentFilter !== "all") {
        // Implement sentiment filtering logic here
      }

      setFilteredReviews(result)

      // Reset active index when filters change
      setActiveIndex(0)
    }
  }, [reviews, ratingFilter, sentimentFilter, keywordFilter])

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isAutoplayPaused && viewMode === "carousel" && filteredReviews.length > 1) {
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
              {filteredBusinesses.map(business => (
                <SelectItem key={business.id} value={business.id}>
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
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Business Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden sm:table-cell">Location</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3 w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map(business => (
                    <tr
                      key={business.id}
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedBusiness?.id === business.id ? "bg-primary/10" : ""
                      )}
                      onClick={() => handleBusinessSelect(business.id)}
                    >
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium line-clamp-1">{business.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">{business.location}</td>
                      <td className="p-3 text-right">
                        <Button
                          variant={selectedBusiness?.id === business.id ? "default" : "ghost"}
                          size="sm"
                          className="h-8"
                        >
                          {selectedBusiness?.id === business.id ? "Selected" : "Select"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Building className="h-8 w-8 text-muted-foreground mb-3 opacity-20" />
                        <p className="text-muted-foreground">No businesses found</p>
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
    )
  }

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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Building className="h-4 w-4" />
          Select a Business
        </Button>
      </div>
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

          {/* View Mode Selector (only show if business is selected) */}
          {selectedBusiness && (
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
          )}
        </div>
      </div>

      {/* Business Selector Section */}
      {renderBusinessSelector()}

      <Separator className="my-6" />

      {/* If no business selected, show message */}
      {!selectedBusiness ? (
        renderNoBusinessSelected()
      ) : (
        <>
          {/* Business Info Header */}
          <div className="mb-6">
            <h3 className="text-xl font-medium flex items-center">
              <Store className="h-5 w-5 mr-2 text-primary" />
              Reviews for {selectedBusiness.name}
            </h3>
            <p className="text-muted-foreground">{selectedBusiness.location}</p>
          </div>

          {/* Filters - only shown when a business is selected */}
          {showFilters && selectedBusiness && (
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
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

              {/* Active Filters Summary */}
              {(ratingFilter !== "all" || sentimentFilter !== "all" || keywordFilter !== "all") && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    Showing {filteredReviews.length} of {reviews.length} reviews
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-6 ml-2 text-xs"
                    onClick={() => {
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
          {loading ? (
            <GoogleLoader />
          ) : (
            <div className="mb-6">
              {viewMode === "carousel" && renderCarouselView()}
              {viewMode === "grid" && renderGridView()}
              {viewMode === "list" && renderListView()}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MarketingReviews