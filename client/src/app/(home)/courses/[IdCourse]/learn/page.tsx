import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRoutes } from "@/lib/apiRoutes";
import { ICourse, Lecture, Module } from "@/util/interfaces";
import LessonNav from "./_components/lesson-nav";
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

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(apiRoutes.courses.getCourseById(IdCourse), {
    headers: { Cookie: cookieHeader },
    credentials: "include",
    next: { revalidate: 60 },
  });

  if (!response.ok) return;
  const { data } = await response.json();
  const course: ICourse = data;

  if (!course?.isEnrolled) {
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

  return (
    <div className="min-h-screen">
      <LessonNav courseId={IdCourse} />
      <div className="flex gap-6 max-w-[1400px] mx-auto my-5 px-5 items-start">
        <VideoPanel activeModule={activeModule} activeLecture={activeLecture} />
        <LessonSidebar course={course} activeLectureId={activeLecture?.id} />
      </div>
    </div>
  );
};

export default Page;
