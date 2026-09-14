import { MessageSquare } from "lucide-react";
import { getReceivedReviewsAction } from "@/actions/review";
import ReceivedReviewCard from "../components/received-review-card";

export default async function page() {
  const reviews = await getReceivedReviewsAction();
  const awaiting = reviews.filter((review) => !review.reply).length;

  return (
    <main className="w-full bg-background">
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <p className="mt-2 text-muted-foreground">
          {reviews.length === 0
            ? "What your students say about your courses will show up here."
            : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} across your courses${
                awaiting > 0 ? ` · ${awaiting} awaiting a reply` : ""
              }`}
        </p>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              No reviews yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Students who take your courses can leave one from the player
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReceivedReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
