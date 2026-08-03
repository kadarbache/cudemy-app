"use client";

import { useState } from "react";
import { ICourse } from "@/util/interfaces";
import { ALL_CATEGORIES, Filtering } from "./filtering";
import { Feed } from "./feed";

// the page already has every course, so the filter runs here rather than
// going back to the server for a subset of what is on screen
export const CourseCatalog = ({ data }: { data: ICourse[] }) => {
  const [selected, setSelected] = useState(ALL_CATEGORIES);

  const courses =
    selected === ALL_CATEGORIES
      ? data
      : data.filter((course) => course.category.includes(selected));

  return (
    <>
      <Filtering selected={selected} onSelect={setSelected} />
      <Feed data={courses} />
    </>
  );
};
