import { CircleUser, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IEnrolledCourse } from "@/util/interfaces";

function formatEnrolledAt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function Card({ course }: { course: IEnrolledCourse }) {
  const lectureCount =
    course.modules?.flatMap((module) => module.lectures).length ?? 0;

  return (
    <Link
      href={`/courses/${course.id}/learn`}
      className="group p-4 border-1 border-popover-foreground/10 w-auto rounded-lg bg-card hover:border-primary/40 transition-colors"
    >
      <div className="flex flex-col gap-1 text-card-foreground rounded-lg w-auto overflow-hidden relative">
        {/* Thumbnail */}
        <div className="h-[161px] w-full relative">
          <Image
            src={course.secureUrl}
            alt={course.title}
            fill
            className="absolute w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-popover-foreground leading-7 mt-2">
          {course.title.toUpperCase()}
        </h2>
        <p className="flex items-center gap-1 text-sm text-popover-foreground/40">
          <span>
            <CircleUser className="w-4 h-4" />
          </span>
          {course.instructor.name}
        </p>
        <p className="text-sm text-popover-foreground/40">
          {lectureCount} {lectureCount === 1 ? "lecture" : "lectures"}
        </p>
        <p className="text-xs text-popover-foreground/30 mt-1">
          Enrolled {formatEnrolledAt(course.entrolledAt)}
        </p>
      </div>
    </Link>
  );
}
