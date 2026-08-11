"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { removeFromCartAction } from "@/actions/cart";
import { addToWishlistAction } from "@/actions/wishlist";
import { ICartItem } from "@/util/interfaces";
import { effectivePrice } from "@/util/price";

export function CartRow({ item }: { item: ICartItem }) {
  const { course } = item;
  const [isPending, startTransition] = useTransition();
  const [isMoving, startMoving] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCartAction(course.id);
      if (result.status === "success") {
        toast.success(result.message as string);
        // the badge in the nav reads the cart through react query, the page
        // itself is a server component, so both need telling
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.refresh();
      } else {
        toast.error(result.message as string);
      }
    });
  };

  const handleMoveToWishlist = () => {
    startMoving(async () => {
      const wishlisted = await addToWishlistAction(course.id);
      // already being on the wishlist is fine, the course still needs to
      // leave the cart
      if (
        wishlisted.status === "error" &&
        wishlisted.message !== "this course is already in your wishlist"
      ) {
        toast.error(wishlisted.message as string);
        return;
      }

      const removed = await removeFromCartAction(course.id);
      if (removed.status === "success") {
        toast.success("Moved to wishlist");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.refresh();
      } else {
        toast.error(removed.message as string);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
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
            <h2 className="line-clamp-2 text-sm font-bold leading-5 text-popover-foreground transition-colors hover:text-primary sm:text-base sm:leading-6">
              {course.title}
            </h2>
          </Link>
          <p className="mt-1.5 truncate text-xs text-popover-foreground/40">
            {course.instructor.name}
            {course.category[0] && (
              <>
                {" · "}
                <span className="text-primary">{course.category[0]}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 sm:justify-end">
        <div className="flex flex-none flex-col items-start gap-1 sm:h-[90px] sm:justify-center sm:border-l sm:border-popover-foreground/10 sm:pl-5">
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="flex cursor-pointer items-center gap-1 text-sm text-primary transition-colors hover:text-primary/70 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Remove
          </button>
          <button
            onClick={handleMoveToWishlist}
            disabled={isMoving}
            className="flex cursor-pointer items-center gap-1 text-sm text-popover-foreground/40 transition-colors hover:text-popover-foreground/70 disabled:opacity-50"
          >
            {isMoving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Move to wishlist
          </button>
        </div>

        <div className="flex flex-none flex-col items-end sm:w-28">
          <span className="font-outfit text-xl font-bold tabular-nums text-popover-foreground">
            ${effectivePrice(course).toFixed(2)}
          </span>
          {course.discount > 0 && (
            <span className="text-sm text-primary line-through tabular-nums">
              ${course.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
