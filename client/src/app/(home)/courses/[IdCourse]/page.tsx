import { Banner } from "@/components/banner";
import { NavigationFixed } from "@/components/navigation";
import { TabMenu } from "@/components/tab-menu";
import VideoPlayerComponent from "@/components/vedioPlayer";
import { getCourseEnrollment, getPublicCourse } from "@/lib/courses";
import { Module } from "@/util/interfaces";
import { notFound } from "next/navigation";
import InstructorProfile from "../_components/instructorProfile";
import PricingCard from "../_components/pricing-card";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ IdCourse: string }>;
  searchParams: Promise<{ vedio: string }>;
}) => {
  const { IdCourse } = await params;
  const { vedio } = await searchParams;

  // the two are independent, so don't make one wait on the other
  const [course, isEnrolled] = await Promise.all([
    getPublicCourse(IdCourse),
    getCourseEnrollment(IdCourse),
  ]);

  if (!course) notFound();

  // this is hard coded now and every course will have a preview lecture
  const previewLecture = course?.modules?.flatMap((m: Module) => m.lectures); // merge all lectures into one array

  // idk if setting the secureUrl to the query is a good idea but it works for now i'm gonna learn more about the correct way of doing this so i can make it better.
  const videoUrl = previewLecture?.[0]?.secureUrl || "";
  return (
    <>
      <Banner />
      <NavigationFixed />
      <section className="container max-w-7xl mx-auto py-[60px] ">
        {/* container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between content-start items-center relative px-4 py-2">
          {/* course */}
          <div className="grid-cols-1 md:col-span-2 flex flex-col justify-start">
            {/* course Video */}
            <VideoPlayerComponent
              video={vedio !== "" ? vedio : videoUrl}
              videoUrl={videoUrl}
            />

            {/* price card for mobiles */}
            <div className="block md:hidden py-2">
              <PricingCard course={course} isEnrolled={isEnrolled} />
            </div>
            {/* course title */}
            <h1 className="text-lg font-bold text-popover-foreground leading-7">
              {course?.title}
            </h1>
            {/* course description */}
            <p className="text-sm text-popover-foreground/60 mt-2">
              {course?.description}
            </p>
            {/* reviews and course modules */}
            <TabMenu data={course} />
            {/* Instructor info */}
            <InstructorProfile
              instructor={course?.instructor}
              stats={course?.instructorStats}
              courseStudents={course?._count?.students}
            />
            {/* <Reviews/> */}
          </div>
          {/* Block for puying the course */}
          <div className="w-full hidden md:block md:grid-cols-1 md:col-start-3 md:col-end-4 self-start justify-self-center max-w-md mx-auto bg-popover rounded-lg p-6 shadow-search-ba font-poppins">
            <PricingCard course={course} isEnrolled={isEnrolled} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
