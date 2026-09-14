"use client";
import React, { useState } from "react";
import { Reviews } from "@/app/(home)/courses/_components/reviews";
import CourseCurriculum from "@/app/(home)/courses/_components/modules";
import { IRatingDistribution, ICourse, IReview } from "@/util/interfaces";

export const TabMenu = ({
  data,
  reviews,
  distribution,
  currentUserId,
  canReview,
}: {
  data: ICourse;
  reviews: IReview[];
  distribution: IRatingDistribution;
  currentUserId: string | null;
  canReview: boolean;
}) => {
  const [tabMenu, setTabMenu] = useState("course");

  const HandleTabMenus = (tab: string) => {
    setTabMenu(tab);
  };

  return (
    <>
      <div className="flex justify-start gap-4 mt-6 text-popover-foreground/80 px-4 py-2">
        <button
          className={`${
            tabMenu === "reviews" &&
            " underline underline-offset-4 decoration-3 decoration-[var(--primary-color)]"
          } hover:text-popover-foreground/50 transition-all cursor-pointer`}
          onClick={() => HandleTabMenus("reviews")}
        >
          reviews
        </button>
        <button
          className={`${
            tabMenu === "course" &&
            " underline underline-offset-4 decoration-3 decoration-[var(--primary-color)]"
          } hover:text-popover-foreground/50 transition-all cursor-pointer`}
          onClick={() => HandleTabMenus("course")}
        >
          Course
        </button>
      </div>
      {tabMenu === "reviews" && (
        <Reviews
          courseId={data.id}
          reviews={reviews}
          distribution={distribution}
          averageRating={data.averageRating ?? null}
          reviewCount={data.reviewCount ?? 0}
          currentUserId={currentUserId}
          canReview={canReview}
          instructor={data.instructor}
        />
      )}
      {tabMenu === "course" && <CourseCurriculum course={data} />}
    </>
  );
};
