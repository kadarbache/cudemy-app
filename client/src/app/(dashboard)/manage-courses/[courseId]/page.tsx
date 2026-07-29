import { Button } from "@/components/ui/button";
import { getCookies } from "@/lib/helpers";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseContent from "../components/course-content";
import Image from "next/image";
import ActionButtons from "../components/action-buttons";

export default async function page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const cookieHeader = await getCookies();
  const response = await fetch(
    `http://localhost:3000/api/v1/course/yourcourse/${courseId}`,
    {
      headers: { cookie: cookieHeader },
    },
  );
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  const { data } = await response.json();
  const course = data.course;

  if (!course) {
    notFound();
  }

  const modules = course.modules;

  return (
    <main className="w-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center gap-4 relative group">
          <Link
            className="absolute top-0 left-0 z-10 transform translate-x-[-50%] translate-y-[50%]"
            href="/manage-courses"
          >
            <Button
              className="group-hover:cursor-pointer"
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Course Header Content */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-stretch">
            {/* Course Thumbnail */}
            <div className="flex-shrink-0">
              <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border md:h-40 md:w-64">
                <Image
                  src={course.secureUrl || "/assets/Thumbnail.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Course Title and Description */}
            <div className="flex flex-1 flex-col justify-between min-h-full max-w-3xl">
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="mt-2 line-clamp-2 text-muted-foreground">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Action Buttons - This will be pushed to the bottom */}
              <ActionButtons course={course} />
            </div>
          </div>
        </div>
      </div>
      <CourseContent modules={modules} courseId={courseId} />
    </main>
  );
}
