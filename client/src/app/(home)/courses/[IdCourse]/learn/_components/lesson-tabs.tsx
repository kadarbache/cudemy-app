"use client";
import { FileText, Paperclip, Star } from "lucide-react";
import { useState } from "react";
import ReviewForm from "@/app/(home)/courses/_components/review-form";
import { cn } from "@/lib/utils";
import { IReview, Lecture, Module } from "@/util/interfaces";

type TabId = "overview" | "resources" | "review";

export default function LessonTabs({
  activeModule,
  activeLecture,
  courseId,
  existingReview,
  canReview,
}: {
  activeModule: Module | undefined;
  activeLecture: Lecture | undefined;
  courseId: string;
  // the viewer's own review, when they have already written one
  existingReview: IReview | null;
  // false for the instructor, who cannot review their own course
  canReview: boolean;
}) {
  const [active, setActive] = useState<TabId>("overview");

  // the instructor gets no review tab at all, rather than one that refuses them
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: FileText },
    { id: "resources" as const, label: "Resources", icon: Paperclip },
    ...(canReview
      ? [
          {
            id: "review" as const,
            label: existingReview ? "Your review" : "Leave a review",
            icon: Star,
          },
        ]
      : []),
  ];

  return (
    <div className="mt-6">
      <div className=// overflow-y-hidden matters: setting overflow-x alone makes the
        // other axis compute to auto, which draws a stray scrollbar
        "flex items-center gap-6 overflow-x-auto overflow-y-hidden border-b border-popover-foreground/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            aria-current={active === tab.id}
            className={cn(
              // -mb-px so the active underline sits on the container's border
              // rather than a pixel below it
              "-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors",
              active === tab.id
                ? "border-[var(--primary-color)] font-semibold text-popover-foreground"
                : "border-transparent text-popover-foreground/50 hover:text-popover-foreground/80",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active === "overview" && (
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-wide text-popover-foreground/40">
              {activeModule?.title}
            </div>
            <h2 className="mt-1 text-xl font-bold">{activeLecture?.title}</h2>
            {activeLecture?.description ? (
              <p className="mt-3 text-sm leading-relaxed text-popover-foreground/60">
                {activeLecture.description}
              </p>
            ) : (
              <p className="mt-3 text-sm text-popover-foreground/40">
                This lesson has no description yet.
              </p>
            )}
          </div>
        )}

        {active === "resources" && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-popover-foreground/15 py-12">
            <Paperclip className="mb-3 h-8 w-8 text-popover-foreground/30" />
            <p className="text-sm font-medium text-popover-foreground/70">
              No resources for this lesson
            </p>
            <p className="mt-1 text-xs text-popover-foreground/40">
              Anything your instructor attaches will show up here
            </p>
          </div>
        )}

        {active === "review" && (
          <div className="max-w-2xl">
            {/* the review is of the whole course, not this lecture, and the same
                form sits behind every lecture in the player, so say so */}
            <h2 className="text-xl font-bold">
              {existingReview
                ? "Your review of this course"
                : "Rate this course"}
            </h2>
            <p className="mt-1 text-sm text-popover-foreground/50">
              {existingReview
                ? "You can change or remove this at any time."
                : "Your review covers the whole course, not just this lesson."}
            </p>
            <div className="mt-6">
              <ReviewForm courseId={courseId} existing={existingReview} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
