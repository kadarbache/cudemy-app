import Image from "next/image";
import { StarRating } from "@/components/star-rating";
import { IReview } from "@/util/interfaces";
import { relativeTime } from "@/util/relativeTime";

export const Review = ({
  review,
  isMine = false,
  action,
}: {
  review: IReview;
  isMine?: boolean;
  // the edit control, only ever passed for the caller's own review
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-popover border border-popover-foreground/30 max-w-2xl">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full relative flex-shrink-0">
          <Image
            alt={review.user.name}
            src={review.user.image}
            fill
            sizes="48px"
            className="absolute w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold font-poppins text-popover-foreground">
              {review.user.name}
            </p>
            {isMine && (
              <span className="text-xs text-[var(--primary-color)]">(you)</span>
            )}
            <p className="text-[var(--primary-color)]">~</p>
            <p className="text-xs text-popover-foreground/60">
              {relativeTime(review.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <StarRating value={review.rating} />
          </div>
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {review.body && (
        <p className="text-sm text-popover-foreground/80 mt-1 whitespace-pre-line">
          {review.body}
        </p>
      )}
    </div>
  );
};
