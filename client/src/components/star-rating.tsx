"use client";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/*
 RenderStars draws nothing at all for an empty star, which works for the search
 filter it was written for but leaves a review card looking half rendered. These
 two always draw five stars and dim the empty ones.

 The display rounds to the nearest whole star: a partial fill needs clipping and
 the exact average is always printed next to it anyway.
*/

export function StarRating({ value }: { value: number }) {
  const filled = Math.round(value);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < filled
              ? "fill-amber-400 text-amber-400"
              : "fill-popover-foreground/15 text-popover-foreground/15",
          )}
        />
      ))}
    </div>
  );
}

// A person picks a whole number of stars, so there is no half step here.
export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  // hovering previews the score it would set, so the filled count follows the
  // pointer rather than the committed value
  const shown = hovered || value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label="Your rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= shown
                ? "fill-amber-400 text-amber-400"
                : "fill-popover-foreground/15 text-popover-foreground/15",
            )}
          />
        </button>
      ))}
    </div>
  );
}
