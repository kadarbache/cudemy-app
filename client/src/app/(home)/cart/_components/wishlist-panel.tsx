"use client";
import { Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addToCartAction } from "@/actions/cart";
import { removeFromWishlistAction } from "@/actions/wishlist";
import { IWishlistItem } from "@/util/interfaces";
import { effectivePrice } from "@/util/price";

function WishlistRow({ item }: { item: IWishlistItem }) {
  const { course } = item;
  const [isRemoving, startRemoving] = useTransition();
  const [isMoving, startMoving] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleRemove = () => {
    startRemoving(async () => {
      const result = await removeFromWishlistAction(course.id);
      if (result.status === "success") {
        toast.success(result.message as string);
        router.refresh();
      } else {
        toast.error(result.message as string);
      }
    });
  };

  const handleMoveToCart = () => {
    startMoving(async () => {
      const added = await addToCartAction(course.id);
      // already being in the cart is fine, the course still needs to leave
      // the wishlist
      if (
        added.status === "error" &&
        added.message !== "this course is already in your cart"
      ) {
        toast.error(added.message as string);
        return;
      }

      const removed = await removeFromWishlistAction(course.id);
      if (removed.status === "success") {
        toast.success("Moved to cart");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.refresh();
      } else {
        toast.error(removed.message as string);
      }
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 sm:p-5">
      <Link
        href={`/courses/${course.id}`}
        className="relative h-[68px] w-[120px] flex-none overflow-hidden rounded-md sm:h-[90px] sm:w-40"
      >
        <Image
          src={course.secureUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/courses/${course.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-popover-foreground transition-colors hover:text-primary sm:text-base">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1.5 truncate text-xs text-popover-foreground/40">
          {course.instructor.name}
        </p>
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={handleMoveToCart}
            disabled={isMoving}
            className="flex cursor-pointer items-center gap-1 text-sm text-primary transition-colors hover:text-primary/70 disabled:opacity-50"
          >
            {isMoving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Move to cart
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex cursor-pointer items-center gap-1 text-sm text-popover-foreground/40 transition-colors hover:text-popover-foreground/70 disabled:opacity-50"
          >
            {isRemoving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Remove
          </button>
        </div>
      </div>

      <span className="flex-none font-outfit text-base font-bold tabular-nums text-popover-foreground">
        ${effectivePrice(course).toFixed(2)}
      </span>
    </div>
  );
}

export function WishlistPanel({ items }: { items: IWishlistItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border-1 border-popover-foreground/10 bg-card">
      <div className="flex items-center gap-2 border-b border-popover-foreground/10 px-4 py-4 sm:px-5">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-medium text-popover-foreground">
          {items.length} {items.length === 1 ? "course" : "courses"} in your
          wishlist
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-4 text-sm text-popover-foreground/40 sm:px-5">
          Courses you save with &ldquo;Move to wishlist&rdquo; will show up
          here.
        </p>
      ) : (
        <div className="divide-y divide-popover-foreground/10">
          {items.map((item) => (
            <WishlistRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
