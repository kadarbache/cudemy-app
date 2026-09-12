"use client";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/actions/review";
import { StarRatingInput } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IReview } from "@/util/interfaces";

// the same rules the controller enforces, checked here so a mistake costs no
// round trip
const MAX_BODY_LENGTH = 1000;

const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Pick a rating from 1 to 5 stars")
    .max(5, "Pick a rating from 1 to 5 stars"),
  body: z
    .string()
    .max(MAX_BODY_LENGTH, `Keep it under ${MAX_BODY_LENGTH} characters`),
});

export default function ReviewForm({
  courseId,
  existing,
  onDone,
}: {
  courseId: string;
  // the caller's own review, when they already wrote one
  existing?: IReview | null;
  // lets the course page collapse the form again after an edit
  onDone?: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [body, setBody] = useState(existing?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    const parsed = reviewSchema.safeParse({ rating, body });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = existing
        ? await updateReviewAction(courseId, rating, body)
        : await createReviewAction(courseId, rating, body);

      if (result.status === "error") {
        toast.error(result.message ?? "Something went wrong");
        return;
      }

      toast.success(result.message ?? "Saved");
      // the list and the average are rendered on the server, so the page has to
      // come back down for either to change
      router.refresh();
      onDone?.();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReviewAction(courseId);

      if (result.status === "error") {
        toast.error(result.message ?? "Something went wrong");
        return;
      }

      toast.success(result.message ?? "Removed");
      setRating(0);
      setBody("");
      router.refresh();
      onDone?.();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <StarRatingInput
        value={rating}
        onChange={setRating}
        disabled={isPending}
      />

      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        disabled={isPending}
        rows={4}
        maxLength={MAX_BODY_LENGTH}
        placeholder="What did you make of this course? (optional)"
        className="resize-none"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-popover-foreground/40">
          {body.length}/{MAX_BODY_LENGTH}
        </span>

        <div className="flex items-center gap-2">
          {existing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
          {onDone && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDone}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Saving..." : existing ? "Update review" : "Post review"}
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
