"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleUser, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { searchCoursesAction } from "@/actions/course";
import { RenderStars } from "@/components/renderStars";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ICourse } from "@/util/interfaces";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // wait until the user pauses before asking the server
  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // start from a clean sheet every time the dialog is reopened
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSearchTerm("");
    }
  }, [open]);

  const { data: courses = [], isPending } = useQuery({
    queryKey: ["courseSearch", searchTerm],
    queryFn: () => searchCoursesAction(searchTerm),
    enabled: open,
  });

  const handleSelect = (courseId: string) => {
    onOpenChange(false);
    router.push(`/courses/${courseId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[8vh] translate-y-0 w-[92vw] max-w-[640px] sm:max-w-[640px] max-h-[80vh] p-0 gap-0 bg-popover overflow-hidden"
      >
        <DialogTitle className="sr-only">Search courses</DialogTitle>
        <DialogDescription className="sr-only">
          Search for courses, instructors and topics
        </DialogDescription>

        {/* search field */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-popover-foreground/10">
          <Search className="w-[18px] h-[18px] text-primary shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for courses, instructors, topics"
            className="flex-1 bg-transparent border-none outline-none font-poppins text-sm text-popover-foreground placeholder:text-popover-foreground/30"
          />
          <DialogClose className="text-popover-foreground/40 hover:text-popover-foreground transition-colors cursor-pointer p-1">
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* results */}
        <div className="overflow-y-auto py-2">
          {isPending ? (
            <ResultsSkeleton />
          ) : courses.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-popover-foreground/60">
              No courses match &quot;{searchTerm}&quot;
            </p>
          ) : (
            <>
              <p className="px-5 py-1.5 text-xs uppercase tracking-wide text-popover-foreground/40">
                {searchTerm
                  ? `${courses.length} ${courses.length === 1 ? "result" : "results"}`
                  : "Popular courses"}
              </p>
              {courses.map((course) => (
                <ResultRow
                  key={course.id}
                  course={course}
                  onSelect={handleSelect}
                />
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultRow({
  course,
  onSelect,
}: {
  course: ICourse;
  onSelect: (courseId: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(course.id)}
      className="flex items-center gap-3.5 w-full px-5 py-2.5 text-left hover:bg-popover-foreground/5 transition-colors cursor-pointer"
    >
      {/* thumbnail */}
      <div className="w-16 h-11 relative shrink-0">
        <Image
          src={course.secureUrl}
          alt={course.title}
          fill
          className="absolute w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-popover-foreground truncate">
          {course.title}
        </p>
        <p className="flex items-center gap-1 text-xs text-popover-foreground/40 mt-0.5">
          <CircleUser className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {course.instructor.name}
            {course.category.length > 0 && ` · ${course.category[0]}`}
          </span>
        </p>
      </div>

      {course.averageRating != null ? (
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          <RenderStars rating={course.averageRating} />
        </div>
      ) : null}

      <p className="font-bold text-sm text-popover-foreground shrink-0">
        {course.price > 0 ? `$${course.price}` : "Free"}
      </p>
    </button>
  );
}

function ResultsSkeleton() {
  return (
    <div className="px-5 py-1.5 space-y-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-3.5">
          <Skeleton className="w-16 h-11 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
