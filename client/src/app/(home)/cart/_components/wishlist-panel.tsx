import { Heart } from "lucide-react";

// UI only. Nothing writes a wishlist yet, so the count is always zero and the
// panel only ever shows its empty state.
export function WishlistPanel() {
  return (
    <div className="rounded-lg border-1 border-popover-foreground/10 bg-card px-4 py-4 sm:px-5">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-medium text-popover-foreground">
          0 courses in your wishlist
        </h2>
      </div>
      <p className="mt-1 text-sm text-popover-foreground/40">
        Courses you save with &ldquo;Move to wishlist&rdquo; will show up here.
      </p>
    </div>
  );
}
