import { notFound, redirect } from "next/navigation";
import { getCourseEnrollment, getPublicCourse } from "@/lib/courses";
import { getCourseReviewsAction } from "@/actions/review";
import { getUserSession } from "@/actions/authentication";
import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import { Lecture, Module } from "@/util/interfaces";
import VideoPanel from "./_components/video-panel";
import LessonSidebar from "./_components/lesson-sidebar";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ IdCourse: string }>;
  searchParams: Promise<{ lecture?: string }>;
}) => {
  const { IdCourse } = await params;
  const { lecture } = await searchParams;

  const [course, isEnrolled, courseReviews, userSession] = await Promise.all([
    getPublicCourse(IdCourse),
    getCourseEnrollment(IdCourse),
    getCourseReviewsAction(IdCourse),
    getUserSession(),
  ]);

  if (!course) notFound();

  // the gate reads an uncached fetch now, so it can no longer let someone in on
  // a stale enrollment
  if (!isEnrolled) {
    redirect(`/courses/${IdCourse}`);
  }

  const modules: Module[] = course.modules || [];
  const allLectures = modules.flatMap((m) => m.lectures);
  const activeLecture: Lecture | undefined = lecture
    ? allLectures.find((l) => l.id === lecture)
    : allLectures[0];
  const activeModule = modules.find((m) =>
    m.lectures.some((l) => l.id === activeLecture?.id),
  );

  // getting this far means enrolled, so the only thing left to rule out is an
  // instructor reviewing their own course
  const canReview = userSession?.id !== course.instructor?.id;
  const existingReview =
    courseReviews.reviews.find((review) => review.userId === userSession?.id) ??
    null;

  return (
    <div className="min-h-screen">
      <NavigationFixed />
      <MobileNavigation hideFrom="lg" />
      <div className="flex gap-6 max-w-[1400px] mx-auto mt-[var(--margin-section-top)] mb-5 px-5 items-start">
        <VideoPanel
          activeModule={activeModule}
          activeLecture={activeLecture}
          courseId={IdCourse}
          existingReview={existingReview}
          canReview={canReview}
        />
        <LessonSidebar course={course} activeLectureId={activeLecture?.id} />
      </div>
    </div>
  );
};

export default Page;
