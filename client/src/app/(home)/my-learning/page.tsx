import { cookies } from "next/headers";
import Link from "next/link";
import Footer from "@/components/footer";
import { NavigationFixed } from "@/components/navigation";
import { PageHeader } from "@/components/page-header";
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
    // min-h-screen + flex-1 on the content keeps the footer at the bottom
    // instead of leaving background below it on a short list
    <div className="flex min-h-screen flex-col">
      <NavigationFixed />
      <PageHeader
        title="My Learning"
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: "My Learning" },
        ]}
        subtitle="Here you can find your enrolled courses."
      />

      <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 flex-1">
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
    </div>
  );
};

export default Page;
