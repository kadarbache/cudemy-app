"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CircleDot, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import durationFormatterString from "@/util/durationFormatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICourse, Lecture, Module } from "@/util/interfaces";

export default function LessonSidebar({
  course,
  activeLectureId,
}: {
  course: ICourse;
  activeLectureId: string | undefined;
}) {
  const modules: Module[] = course?.modules || [];
  const initialOpenIndex = modules.findIndex((m) =>
    m.lectures.some((l) => l.id === activeLectureId),
  );
  const [openModule, setOpenModule] = useState(
    initialOpenIndex === -1 ? 0 : initialOpenIndex,
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectLecture = (lectureId: string) => {
    const routeURL = new URLSearchParams(searchParams);
    routeURL.set("lecture", lectureId);
    router.replace(`${pathname}?${routeURL.toString()}`);
  };

  return (
    <div className="w-[340px] flex-shrink-0 bg-popover rounded-lg overflow-hidden">
      <div className="px-[18px] py-4 border-b border-popover-foreground/10 font-bold">
        Course content
      </div>
      {modules.map((module, moduleIndex) => {
        const isOpen = openModule === moduleIndex;
        return (
          <div
            key={module.id}
            className="border-b border-popover-foreground/10 last:border-b-0"
          >
            <div
              onClick={() => setOpenModule(isOpen ? -1 : moduleIndex)}
              className="flex justify-between items-center px-[18px] py-3.5 cursor-pointer text-sm font-semibold"
            >
              <span>{module.title}</span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-popover-foreground/40" />
              ) : (
                <ChevronRight className="w-4 h-4 text-popover-foreground/40" />
              )}
            </div>
            {isOpen && (
              <div className="pb-2">
                {module.lectures.map((lecture: Lecture) => {
                  const isCurrent = lecture.id === activeLectureId;
                  return (
                    <div
                      key={lecture.id}
                      onClick={() => handleSelectLecture(lecture.id)}
                      className={cn(
                        "flex items-center gap-2.5 py-2.5 pl-8 pr-[18px] cursor-pointer",
                        isCurrent && "bg-primary/10",
                      )}
                    >
                      {isCurrent ? (
                        <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <CircleDot className="w-4 h-4 text-popover-foreground/30 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          isCurrent
                            ? "text-popover-foreground"
                            : "text-popover-foreground/70",
                        )}
                      >
                        {lecture.title}
                      </span>
                      {lecture.isPreview && (
                        <span className="text-[10px] text-teal-500 border border-teal-500 rounded px-1.5 py-0.5">
                          PREVIEW
                        </span>
                      )}
                      <span className="text-xs text-popover-foreground/40">
                        {durationFormatterString(lecture.duration)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
