import { ArrowRight, CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ICourse } from "@/util/interfaces";
import { effectivePrice } from "@/util/price";

// RenderStars draws nothing for an empty star, and no course carries a rating
// yet, so it would leave a blank gap here. Dimmed stars read as "not rated"
// without inventing a score.
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="relative h-3.5 w-3.5">
          <Image
            src="/assets/Star.svg"
            alt=""
            fill
            className={index < Math.round(rating) ? "" : "opacity-20"}
          />
        </div>
      ))}
    </div>
  );
}

// Real courses from the catalogue, not a recommendation engine. There is no
// ranking behind this yet, it just shows what the cart does not already hold.
export function Recommendations({ courses }: { courses: ICourse[] }) {
  if (courses.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold leading-[26px] text-popover-foreground">
          You might also like
        </h2>
        <Link
          href="/courses"
          className="flex flex-none items-center gap-1 text-sm text-primary transition-colors hover:text-primary/70"
        >
          View courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group rounded-lg border-1 border-popover-foreground/10 bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="relative h-[130px] w-full overflow-hidden rounded-lg">
              <Image
                src={course.secureUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-popover-foreground transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-popover-foreground/40">
              <CircleUser className="h-4 w-4 flex-none" />
              <span className="truncate">{course.instructor.name}</span>
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Stars rating={course.rating ?? 0} />
              <span className="text-xs text-popover-foreground/40">
                {course.numberOfLectures} lectures
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <span className="font-outfit text-base font-bold tabular-nums text-popover-foreground">
                ${effectivePrice(course).toFixed(2)}
              </span>
              {course.discount > 0 && (
                <span className="text-xs text-primary line-through tabular-nums">
                  ${course.price.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
