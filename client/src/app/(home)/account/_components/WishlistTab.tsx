"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
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

function WishlistCard({ item }: { item: IWishlistItem }) {
  const { course } = item;
  const [isRemoving, startRemoving] = useTransition();
  const [isAdding, startAdding] = useTransition();
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

  const handleAddToCart = () => {
    startAdding(async () => {
      const result = await addToCartAction(course.id);
      if (result.status === "success") {
        toast.success(result.message as string);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(result.message as string);
      }
    });
  };

  return (
    <div className="p-4 border-1 border-popover-foreground/10 rounded-lg bg-card">
      <div className="flex flex-col gap-1 text-card-foreground rounded-lg w-auto overflow-hidden relative">
        <div className="h-[161px] w-full relative">
          <Link href={`/courses/${course.id}`}>
            <Image
              src={course.secureUrl}
              alt={course.title}
              fill
              className="absolute w-full h-full object-cover rounded-lg"
            />
          </Link>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label="Remove from wishlist"
            className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <Link href={`/courses/${course.id}`}>
          <h2 className="text-lg font-bold text-popover-foreground leading-7 mt-2 line-clamp-2">
            {course.title.toUpperCase()}
          </h2>
        </Link>
        <p className="text-sm text-popover-foreground/40">
          {course.instructor.name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-outfit text-lg font-bold tabular-nums text-popover-foreground">
            ${effectivePrice(course).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/70 disabled:opacity-50"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistTab({
  items,
}: {
  items: IWishlistItem[] | null;
}) {
  if (items === null) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          We couldn&apos;t load your wishlist right now.
        </p>
        <Link
          href="/auth/login"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Sign in to see your wishlist
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
        <Link
          href="/courses"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-6">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} />
      ))}
    </div>
  );
}
