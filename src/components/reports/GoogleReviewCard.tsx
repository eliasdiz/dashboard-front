import type React from "react"
import { Star } from "lucide-react"
import Image from "next/image"

type Reviewer = {
  displayName: string
  profilePhotoUrl: string
}

type Reply = {
  comment: string
}

type Review = {
  createTime: string
  rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
  reviewText: string
  reviewer: Reviewer
  reviewReply?: Reply
}

type Props = {
  review: Review
}

const ratingToNumber: Record<Review["rating"], number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

const GoogleReviewCard: React.FC<Props> = ({ review }) => {
  const { createTime, rating, reviewText, reviewer } = review
  const stars = ratingToNumber[rating]

  // Format date for better display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      console.log(e)
      return dateString
    }
  }

  return (
    <div className="flex flex-col justify-start items-start w-full h-full border border-gray-200 shadow-md p-3 sm:p-4 md:p-5 rounded-lg bg-white transition-shadow hover:shadow-lg">
      <div className="flex items-center w-full mb-3 sm:mb-4">
        {reviewer.profilePhotoUrl ? (
          <Image
            src={reviewer.profilePhotoUrl || "/placeholder.svg"}
            alt={reviewer.displayName || "Reviewer"}
            loading="lazy"
            width={50}
            height={50}
            referrerPolicy="no-referrer"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 object-cover flex-shrink-0"
            onError={(e) => {
              // Fallback if image fails to load
              ;(e.target as HTMLImageElement).src =
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(reviewer.displayName || "User")
            }}
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 text-sm font-medium">
              {(reviewer.displayName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-grow min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{reviewer.displayName || "Anonymous Reviewer"}</p>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{formatDate(createTime)}</p>
        </div>
      </div>

      <div className="flex items-center mb-2 sm:mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4"
            fill={i < stars ? "currentColor" : "none"}
            stroke="currentColor"
          />
        ))}
      </div>

      <div className="w-full">
        <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed break-words">
          {reviewText || "No review text provided."}
        </p>
      </div>

      {review.reviewReply?.comment && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Business Reply:</p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{review.reviewReply.comment}</p>
        </div>
      )}
    </div>
  )
}

export default GoogleReviewCard

