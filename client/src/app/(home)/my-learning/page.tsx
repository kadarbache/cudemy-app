import { cookies } from "next/headers";
import Link from "next/link";
import Footer from "@/components/footer";
import { NavigationFixed } from "@/components/navigation";
import { apiRoutes } from "@/lib/apiRoutes";
import { IEnrolledCourse } from "@/util/interfaces";
import { CourseList } from "./_components/course-list";

async function getEnrolledCourses(): Promise<IEnrolledCourse[] | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(apiRoutes.courses.getEnrolledCourses, {
    headers: { Cookie: cookieHeader },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) return null;
  const { data } = await response.json();
  return data.courses;
}

const Page = async () => {
  const courses = await getEnrolledCourses();

  return (
    <>
      <NavigationFixed />
      <div className="container mx-auto mt-[var(--margin-section-top)] px-4">
        <h1 className="py-3 lg:py-0 text-2xl font-bold text-center text-popover-foreground">
          My Learning
        </h1>
        <p className="text-center text-popover-foreground/50 mt-2">
          Here you can find your enrolled courses.
        </p>
      </div>

      <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 min-h-[40vh]">
        {courses === null ? (
          <div className="text-center py-16">
            <p className="text-popover-foreground/60">
              We couldn&apos;t load your courses right now.
            </p>
            <Link
              href="/auth/login"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Sign in to see your learning
            </Link>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-popover-foreground/60">
              You have no enrolled courses yet.
            </p>
            <Link
              href="/courses"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <CourseList courses={courses} />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Page;
