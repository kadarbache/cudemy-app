import { CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ICourse } from "@/util/interfaces";

/*
 the rating functionality be implemented in the future
*/

function Card({ courses }: { courses: ICourse[] }) {
  return (
    <>
      {courses.map((course: ICourse) => (
        <div
          key={course.id}
          className="p-4 border-1 border-popover-foreground/10 w-auto rounded-lg bg-card text-card-foreground overflow-hidden relative"
        >
          <Link href={`/courses/${course.id}`} className="no-underline">
            {/* badge / best seller */}
            <div className="absolute top-7 left-7 bg-[#EADB36] text-black/70 text-xs font-bold py-1 px-2 rounded-lg z-10">
              Best Seller
            </div>
            {/* Thumbnail */}
            <div className="h-[161px] w-full relative">
              <Image
                src={course.secureUrl}
                alt="Thumbnail"
                fill
                className="absolute w-full h-full object-cover rounded-lg"
              />
            </div>
            <h2 className="text-lg font-bold text-popover-foreground leading-7">
              {course.title.toUpperCase()}
            </h2>
            <p className="flex items-center gap-1 text-sm text-popover-foreground/40">
              <span>
                <CircleUser />
              </span>
              {course.instructor.name}{" "}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => {
                const rating = course.rating ?? 0;
                if (rating >= index + 1) {
                  return (
                    <div className="w-4 h-4 relative" key={index}>
                      <Image
                        src="/assets/Star.svg"
                        alt="Star"
                        className="absolute w-full h-full"
                        fill
                      />
                    </div>
                  );
                } else if (rating > index && rating < index + 1) {
                  return (
                    <div className="w-4 h-4 relative" key={index}>
                      <Image
                        src="/assets/HalfStar.svg"
                        alt="Half Star"
                        className="absolute w-fit h-fit"
                        fill
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="w-4 h-4 relative" key={index}>
                      <Image
                        src="/assets/Star.svg"
                        alt="Star"
                        className="absolute w-full h-full"
                        fill
                      />
                    </div>
                  );
                }
              })}
              <span className="text-sm text-popover-foreground/60">
                ({course.numberOfLectures})
              </span>
            </div>
            {/* price */}
            <div className="flex items-center justify-start gap-4">
              {/* current Price */}
              <p className="text-lg font-bold text-popover-foreground">$90</p>
              {/* original Price */}
              <p className="text-sm text-popover-foreground/60 line-through">
                $120
              </p>
            </div>
          </Link>
        </div>
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
