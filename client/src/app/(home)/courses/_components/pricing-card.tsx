"use client";
import {
  Heart,
  BookOpen,
  Play,
  Volume2,
  NotebookPen,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICourse } from "@/util/interfaces";
import durationFormatterString from "@/util/durationFormatter";
import { enrollCourseAction } from "@/actions/course";
import { addToCartAction } from "@/actions/cart";
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PricingCard({
  course,
  isEnrolled,
  isInCart,
}: {
  course: ICourse;
  isEnrolled: boolean;
  isInCart: boolean;
}) {
  const duration = durationFormatterString(course.totalOfHours);
  const [isPending, startTransition] = useTransition();
  const [isAdding, startAdding] = useTransition();
  // the page it sits on is cached per request, so the button tracks the add
  // itself rather than waiting for the server prop to come back around
  const [inCart, setInCart] = useState(isInCart);
  const queryClient = useQueryClient();

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollCourseAction(course.id);
      if (result.status === "success") {
        toast.success(result.message as string);
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
        setInCart(true);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(result.message as string);
      }
    });
  };

  return (
    <>
      {/* Course Title and Price */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-popover-foreground/90 mb-2 tracking-wide">
          {course.title.toUpperCase()}
        </h2>
        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <span className="text-xl font-bold text-green-600">
              Course Enrolled
            </span>
          ) : (
            <>
              <span className="text-2xl font-bold text-popover-foreground/90">
                ${course.price}
              </span>
              <span className="text-lg text-popover-foreground/40 line-through">
                {course.discount > 0
                  ? `$${(course.price - course.discount).toFixed(2)}`
                  : ""}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        {!isEnrolled && (
          <Button
            onClick={handleEnroll}
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xl py-3 rounded-lg transition-colors cursor-pointer"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
        )}
        {!isEnrolled &&
          (inCart ? (
            <Button
              asChild
              variant="outline"
              className="w-full border-primary text-primary font-bold text-xl py-3 rounded-lg transition-colors bg-transparent cursor-pointer"
              size="lg"
            >
              <Link href="/cart" className="flex items-center justify-center">
                <ShoppingCart size={28} className="mr-2 flex !w-7 !h-7" />
                <p>Go to Cart</p>
              </Link>
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              variant="outline"
              className="w-full border-primary text-primary font-bold text-xl py-3 rounded-lg transition-colors bg-transparent cursor-pointer"
              size="lg"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={28} className="mr-2 flex !w-7 !h-7" />
                  <p>Add to Cart</p>
                </>
              )}
            </Button>
          ))}
        {isEnrolled ? (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-3 rounded-lg transition-colors cursor-pointer"
            size="lg"
            asChild
          >
            <Link href={`/courses/${course.id}/learn`}>Go to Course</Link>
          </Button>
        ) : (
          <Button
            onClick={() => toast("Wishlist is coming soon")}
            variant="outline"
            className="w-full border-primary text-primary font-bold text-xl py-3 rounded-lg transition-colors bg-transparent cursor-pointer"
            size="lg"
          >
            {/* ! is Tailwind's important modifier to override ShadCN's defaults */}
            <Heart size={28} className="mr-2 flex !w-7 !h-7" />
            <p>Wishlist</p>
          </Button>
        )}
      </div>

      {/* Course Details */}
      <div className="space-y-4 flex flex-col gap-1">
        <div className="flex items-center gap-3 text-popover-foreground/60">
          <NotebookPen className="w-5 h-5 text-popover-foreground/50" />
          <span className="text-sm font-medium">
            {course?.modules?.length} Section
          </span>
        </div>

        <div className="flex items-center gap-3 text-popover-foreground/60">
          <BookOpen className="w-5 h-5 text-popover-foreground/50" />
          <span className="text-sm font-medium">
            {course.numberOfLectures} Lectures
          </span>
        </div>

        <div className="flex items-center gap-3 text-popover-foreground/60">
          <Play className="w-5 h-5 text-popover-foreground/50" />
          <span className="text-sm font-medium">{duration} total lengths</span>
        </div>

        <div className="flex items-center gap-3 text-popover-foreground/60">
          <Volume2 className="w-5 h-5 text-popover-foreground/50" />
          <span className="text-sm font-medium">English</span>
        </div>
      </div>
    </>
  );
}
