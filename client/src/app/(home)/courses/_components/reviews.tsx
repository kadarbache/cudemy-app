"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { IRatingDistribution, IReview } from "@/util/interfaces";
import { Review } from "./review";
import ReviewForm from "./review-form";
import ShowMore from "./showMore";

const STARS = [5, 4, 3, 2, 1] as const;
const INITIAL_VISIBLE = 5;

// how many reviews sit on each star. this replaced a "filter by rating" control
// that ran on dummy data: the numbers come free with the average, and a filter
// over a handful of reviews had nothing to filter.
function Distribution({
  distribution,
  reviewCount,
}: {
  distribution: IRatingDistribution;
  reviewCount: number;
}) {
  return (
    // basis, not just a max: inside a flex row a bare max-width leaves the bars
    // sized by their content, which collapses them to nothing
    <div className="flex w-full max-w-xs flex-1 basis-64 flex-col gap-1.5">
      {STARS.map((star) => {
        const count = distribution[star] ?? 0;
        const percent = reviewCount === 0 ? 0 : (count / reviewCount) * 100;

        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-2 text-popover-foreground/60">{star}</span>
            <Star className="h-3 w-3 flex-none fill-amber-400 text-amber-400" />
            <div className="h-1.5 flex-1 rounded-full bg-popover-foreground/15">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-6 flex-none text-right text-popover-foreground/50">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const Reviews = ({
  courseId,
  reviews,
  distribution,
  averageRating,
  reviewCount,
  currentUserId,
  canReview,
  instructor,
}: {
  courseId: string;
  reviews: IReview[];
  distribution: IRatingDistribution;
  averageRating: number | null;
  reviewCount: number;
  // null when signed out, which is also the case where nothing is "mine"
  currentUserId: string | null;
  // enrolled and not the instructor, so an existing review can be edited here
  canReview: boolean;
  // who any reply on this course is from, there is only ever one such person
  instructor?: { name: string; image: string } | null;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [editing, setEditing] = useState(false);

  const mine = currentUserId
    ? reviews.find((review) => review.userId === currentUserId)
    : undefined;
  const others = reviews.filter((review) => review.id !== mine?.id);
  const visible = showMore ? others : others.slice(0, INITIAL_VISIBLE);

  if (reviewCount === 0) {
    return (
      <p className="mt-6 text-sm text-popover-foreground/50">
        No reviews yet. Students who take this course can leave the first one
        from the course player.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* the score, then how it breaks down */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-popover-foreground">
            {averageRating?.toFixed(1)}
          </span>
          <StarRating value={averageRating ?? 0} />
          <span className="mt-1 text-xs text-popover-foreground/50">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>
        <Distribution distribution={distribution} reviewCount={reviewCount} />
      </div>

      {/* the caller's own review sits on top, and is the only one they can change */}
      {mine &&
        (editing ? (
          <div className="max-w-2xl rounded-xl border border-popover-foreground/30 bg-popover p-4">
            <ReviewForm
              courseId={courseId}
              existing={mine}
              onDone={() => setEditing(false)}
            />
          </div>
        ) : (
          <Review
            review={mine}
            isMine
            instructor={instructor}
            action={
              canReview ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="cursor-pointer"
                >
                  Edit
                </Button>
              ) : undefined
            }
          />
        ))}

      <div className="flex flex-col gap-4">
        {visible.map((review) => (
          <Review key={review.id} review={review} instructor={instructor} />
        ))}
      </div>

      {others.length > INITIAL_VISIBLE && (
        <div className="max-w-2xl">
          <ShowMore onHandleShowMore={setShowMore} showMore={showMore} />
        </div>
      )}
    </div>
  );
};
