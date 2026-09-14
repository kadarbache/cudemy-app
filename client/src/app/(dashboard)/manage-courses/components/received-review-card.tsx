"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteReplyAction, replyToReviewAction } from "@/actions/review";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IReceivedReview } from "@/util/interfaces";
import { relativeTime } from "@/util/relativeTime";

// the same ceiling the controller enforces, checked here so a mistake costs no
// round trip
const MAX_REPLY_LENGTH = 1000;

export default function ReceivedReviewCard({
  review,
}: {
  review: IReceivedReview;
}) {
  // an existing reply opens closed, so the queue reads as a list rather than a
  // wall of textareas
  const [editing, setEditing] = useState(false);
  const [reply, setReply] = useState(review.reply ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    const trimmed = reply.trim();
    if (trimmed.length === 0) {
      setError("Write something before posting");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await replyToReviewAction(
        review.courseId,
        review.id,
        trimmed,
      );

      if (result.status === "error") {
        toast.error(result.message ?? "Something went wrong");
        return;
      }

      toast.success(result.message ?? "Saved");
      // the queue is rendered on the server, so it has to come back down
      router.refresh();
      setEditing(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReplyAction(review.courseId, review.id);

      if (result.status === "error") {
        toast.error(result.message ?? "Something went wrong");
        return;
      }

      toast.success(result.message ?? "Removed");
      setReply("");
      router.refresh();
      setEditing(false);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      {/* which course this landed on, the one thing the public list never needs */}
      <Link
        href={`/manage-courses/${review.course.id}`}
        className="flex items-center gap-3 self-start group"
      >
        <div className="relative h-9 w-14 flex-shrink-0 overflow-hidden rounded border border-border">
          <Image
            src={review.course.secureUrl || "/assets/Thumbnail.jpg"}
            alt={review.course.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {review.course.title}
        </span>
      </Link>

      {/* the review itself */}
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src={review.user.image}
            alt={review.user.name}
            fill
            sizes="40px"
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {review.user.name}
            </p>
            <span className="text-xs text-muted-foreground">
              {relativeTime(review.createdAt)}
            </span>
          </div>
          <StarRating value={review.rating} />
        </div>
      </div>

      {review.body && (
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {review.body}
        </p>
      )}

      {/* the answer */}
      {editing ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
          <Textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            disabled={isPending}
            rows={3}
            maxLength={MAX_REPLY_LENGTH}
            placeholder="Answer this review publicly..."
            className="resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {reply.length}/{MAX_REPLY_LENGTH}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReply(review.reply ?? "");
                  setError(null);
                  setEditing(false);
                }}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? "Saving..." : review.reply ? "Update" : "Post"}
              </Button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      ) : review.reply ? (
        <div className="flex flex-col gap-2 rounded-lg border-l-2 border-l-[var(--primary-color)] bg-accent/40 p-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-foreground">
              Your response
            </p>
            {review.repliedAt && (
              <span className="text-xs text-muted-foreground">
                {relativeTime(review.repliedAt)}
              </span>
            )}
          </div>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {review.reply}
          </p>
          <div className="flex items-center gap-2 self-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Edit
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
          className="cursor-pointer self-start"
        >
          Reply
        </Button>
      )}
    </div>
  );
}
