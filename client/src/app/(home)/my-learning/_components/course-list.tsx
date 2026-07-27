"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { IEnrolledCourse } from "@/util/interfaces";
import { Card } from "./card";

type SortKey = "recent" | "title";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recently enrolled" },
  { key: "title", label: "Title A-Z" },
];

export function CourseList({ courses }: { courses: IEnrolledCourse[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const visibleCourses = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = search
      ? courses.filter(
          (course) =>
            course.title.toLowerCase().includes(search) ||
            course.instructor.name.toLowerCase().includes(search),
        )
      : courses;

    return [...filtered].sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : new Date(b.entrolledAt).getTime() - new Date(a.entrolledAt).getTime(),
    );
  }, [courses, query, sort]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-[360px]">
          <Input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your courses"
            className="py-3 pl-10 rounded-lg border-primary placeholder:text-sm placeholder:text-popover-foreground/30"
          />
          <Search className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSort(option.key)}
              className={`text-sm px-3 py-1.5 rounded-md border transition-colors cursor-pointer ${
                sort === option.key
                  ? "border-primary text-primary"
                  : "border-popover-foreground/15 text-popover-foreground/50 hover:text-popover-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-popover-foreground/40 mt-4">
        {visibleCourses.length}{" "}
        {visibleCourses.length === 1 ? "course" : "courses"}
      </p>

      {visibleCourses.length === 0 ? (
        <p className="text-center text-popover-foreground/60 py-16">
          No courses match &quot;{query}&quot;.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {visibleCourses.map((course) => (
            <Card key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}
