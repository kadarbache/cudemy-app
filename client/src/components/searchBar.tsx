"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronRight, FlaskConical, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseResult {
  id: string;
  title: string;
  instructorName: string;
  imageUrl: string;
}

interface InstructorResult {
  id: string;
  name: string;
  specialty: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock static data for premium visual layout (based on user's exact design specifications)
  const mockCourses: CourseResult[] = [
    {
      id: "course-1",
      title: "Advanced UI Architecture",
      instructorName: "Sarah Jenkins",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_77sjUUXKAFqE-rr5srhqowE61Kq4w_cJw4ott6OEtGPyPu1ayts2Igge2lvx4A4Ax0roab3dUoO-EzA0_ZwzlOklidEjxqlC9l2dJFqHTTBy5INthGJwnf3ErLTk7No3FnS6xhc7m1zbIAi_fMC8LBNZhHG8fZgHg_gReqxRTDu2jwQPhdoyAqmJiOBgXBrbEJ35xaLbccDKI-OLpFlWemaFSFiIPAbCapz148Tq382WrkzWHYmWC3hP0vBynmGbnxO4WemSubfU",
    },
    {
      id: "course-2",
      title: "Full-Stack React Frameworks",
      instructorName: "Michael Chen",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9OsWq56wVT3i5FYfN362ry-cPPEMrO5B4hpaFklOn0gJRifeOj7hovCPUqdyVSR_LX1IkzKyv7NjJTrY-YjfnayP_NyzsIszFimLRWfU1seWg8M6kqg5TUUsN9ywc-FvVnTcWnlzFO0D1ZnRmJh7Dqu6chZi1Se9PD9g_HdwGFAP_He22dOTXMDg2knbAkWDAOmZH3Lvky5O62TXtJB8_WWkR7XsEMRNzCXsMCzwKmoLjgyzf6IAOPdXKsC5A6rdRQqG0gZNBrzhI",
    },
  ];

  const mockInstructors: InstructorResult[] = [
    {
      id: "inst-1",
      name: "Dr. Elena Rodriguez",
      specialty: "Neural Networks Specialist",
    },
  ];

  // Handle clicking outside the component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block w-[500px] font-sans group"
    >
      {/* Search Input Container */}
      <div className="relative flex items-center w-full transition-transform duration-200 ease-out group-focus-within:scale-[1.01]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-popover-foreground/40 group-focus-within:text-primary transition-colors h-4.5 w-4.5" />
        <input
          type="text"
          placeholder="Search for courses, topics, or instructors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-4 py-3 bg-secondary/40 dark:bg-secondary/20 border border-border/80 dark:border-border/40 rounded-xl font-sans text-[13px] text-popover-foreground placeholder:text-popover-foreground/40 focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all outline-none"
        />
      </div>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-popover border border-border/90 dark:border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden font-sans transition-all animate-in fade-in duration-200">
          <div className="p-2 space-y-1 bg-popover">
            {/* Courses Section */}
            <div>
              <div className="px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-popover-foreground/45 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Courses</span>
              </div>

              {/* Course Item Results */}
              <div className="space-y-0.5">
                {mockCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-secondary/60 dark:hover:bg-secondary/30 rounded-lg cursor-pointer transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg relative overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[13px] font-semibold text-popover-foreground truncate group-hover/item:text-primary transition-colors">
                        {course.title}
                      </div>
                      <div className="text-[11px] text-popover-foreground/60 truncate">
                        {course.instructorName}
                      </div>
                    </div>
                    <ChevronRight className="text-popover-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all w-4.5 h-4.5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Instructors Section */}
            <div className="border-t border-border/50 dark:border-border/30 pt-1 mt-1">
              <div className="px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-popover-foreground/45 uppercase flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Instructors</span>
              </div>

              {/* Instructor Item Results */}
              <div className="space-y-0.5">
                {mockInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="flex items-center gap-3 p-2.5 hover:bg-secondary/60 dark:hover:bg-secondary/30 rounded-lg cursor-pointer transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[13px] font-semibold text-popover-foreground truncate group-hover/item:text-primary transition-colors">
                        {instructor.name}
                      </div>
                      <div className="text-[11px] text-popover-foreground/60 truncate">
                        {instructor.specialty}
                      </div>
                    </div>
                    <ChevronRight className="text-popover-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all w-4.5 h-4.5 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Tip */}
          <div className="bg-secondary/30 dark:bg-secondary/15 px-4 py-2 border-t border-border/60 dark:border-border/30">
            <div className="text-[11px] text-popover-foreground/50 text-center italic">
              Press enter to see all results
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
