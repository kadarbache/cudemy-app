import { Download, FileText, Paperclip, Star } from "lucide-react";
import VideoPlayerComponent from "@/components/vedioPlayer";
import ReviewForm from "@/app/(home)/courses/_components/review-form";
import { IReview, Lecture, Module } from "@/util/interfaces";

const resources = [
  { name: "lesson-slides.pdf", size: "2.4 MB" },
  { name: "starter-code.zip", size: "850 KB" },
  { name: "cheatsheet.pdf", size: "410 KB" },
];

export default function VideoPanel({
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
  return (
    <div className="flex-1 min-w-0">
      <VideoPlayerComponent
        video={activeLecture?.secureUrl}
        videoUrl={activeLecture?.secureUrl || ""}
      />

      <div className="mt-5">
        <div className="text-xs text-popover-foreground/40 uppercase tracking-wide">
          {activeModule?.title}
        </div>
        <div className="font-bold text-xl mt-1">{activeLecture?.title}</div>
        <div className="text-sm text-popover-foreground/60 mt-2 leading-normal">
          {activeLecture?.description}
        </div>
      </div>

      <div className="mt-7 border-t border-popover-foreground/10 pt-5">
        <div className="font-bold flex items-center gap-2">
          <Paperclip className="w-4 h-4" /> Lesson resources
        </div>
        <div className="mt-3 text-sm text-popover-foreground/40">
          No resources available
        </div>
      </div>

      {/* the review is of the whole course, not this lecture, so the heading
          has to say so -- every lecture in the player shows this same form */}
      {canReview && (
        <div className="mt-7 border-t border-popover-foreground/10 pt-5">
          <div className="font-bold flex items-center gap-2">
            <Star className="w-4 h-4" />
            {existingReview ? "Your review of this course" : "Rate this course"}
          </div>
          <div className="mt-4 max-w-2xl">
            <ReviewForm courseId={courseId} existing={existingReview} />
          </div>
        </div>
      )}
    </div>
  );
}
