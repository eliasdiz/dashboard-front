import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

type Reviewer = {
  displayName: string;
  profilePhotoUrl: string;
};

type Reply = {
  comment: string;
};

type Review = {
  createTime: string;
  rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  reviewText: string;
  reviewer: Reviewer;
  reviewReply?: Reply;
};

type Props = {
  review: Review;
};

const ratingToNumber: Record<Review["rating"], number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

const GoogleReviewCard: React.FC<Props> = ({ review }) => {
  const { createTime, rating, reviewText, reviewer } = review;
  const stars = ratingToNumber[rating];

  return (
    <div className="justify-center items-start border border-gray-200 shadow-md w-full p-4 rounded-lg inset-shadow-sm grid md:grid-cols-2 gap-2">
      <div>
        <div className="flex items-center mb-2">
          <Image
            src={reviewer.profilePhotoUrl}
            alt={reviewer.displayName}
            width={400}
            height={400}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{reviewer.displayName}</p>
            <p className="text-sm text-gray-500">{createTime}</p>
          </div>
        </div>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < stars ? "#facc15" : "none"}
              stroke="#facc15"
            />
          ))}
        </div>

        <p className="text-gray-800 text-sm">{reviewText}</p>
      </div>

      {review.reviewReply?.comment && (
        <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-1">
            Business Reply:
          </p>
          <p className="text-sm text-gray-700">{review.reviewReply.comment.slice(0,500)}...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewCard;
