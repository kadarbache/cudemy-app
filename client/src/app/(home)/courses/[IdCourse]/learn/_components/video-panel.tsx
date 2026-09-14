import VideoPlayerComponent from "@/components/vedioPlayer";
import { IReview, Lecture, Module } from "@/util/interfaces";
import LessonTabs from "./lesson-tabs";

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

      <LessonTabs
        activeModule={activeModule}
        activeLecture={activeLecture}
        courseId={courseId}
        existingReview={existingReview}
        canReview={canReview}
      />
    </div>
  );
}
