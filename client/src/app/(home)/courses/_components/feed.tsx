import { ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ICourse } from "@/util/interfaces";
import { effectivePrice } from "@/util/price";

/*
 The tier and the rating row are stand-ins. Nothing behind them exists yet:
 the Course model has no tier flag, no rating and no review count, and the
 catalogue endpoint returns none of the three. The price below is real.
*/

function Card({ courses }: { courses: ICourse[] }) {
  return (
    <>
      {courses.map((course: ICourse) => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="group no-underline flex h-full flex-col p-3 border-1 border-popover-foreground/10 rounded-xl bg-card text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:border-popover-foreground/20 hover:shadow-lg"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={course.secureUrl}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h2 className="mt-3 line-clamp-2 text-base font-bold text-popover-foreground leading-snug">
            {course.title}
          </h2>
          <p className="mt-1 text-sm text-popover-foreground/50">
            {course.instructor.name}
          </p>
          {/* tier + rating, both placeholders */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="bg-[#5624d0] text-white px-2 py-1">
              <ShieldCheck />
              Premium
            </Badge>
            <Badge
              variant="outline"
              className="px-2 py-1 border-popover-foreground/15"
            >
              <Star className="fill-amber-400 text-amber-400" />
              4.6
            </Badge>
            <Badge
              variant="outline"
              className="px-2 py-1 font-normal border-popover-foreground/15 text-popover-foreground/50"
            >
              2,968 ratings
            </Badge>
          </div>
          {/* price, pinned to the bottom so it lines up across the row */}
          <p className="mt-auto pt-3 text-lg font-bold text-popover-foreground">
            ${effectivePrice(course).toFixed(2)}
          </p>
        </Link>
      ))}
    </>
  );
}

export const Feed = ({ data }: { data: ICourse[] }) => {
  return (
    <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[60px]">
      <h2 className="text-popover-foreground font-poppins text-xl font-bold leading-[26px]">
        Here are your personalized recommendations
      </h2>
      {data.length === 0 ? (
        <p className="text-popover-foreground/60 font-poppins mt-8">
          No courses in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <Card courses={data} />
        </div>
      )}
    </section>
  );
};
