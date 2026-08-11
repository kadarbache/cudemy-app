import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import CourseFilters from "./_components/searchCourse";
import React from "react";

const Page = () => {
  return (
    <>
      <NavigationFixed />
      <MobileNavigation hideFrom="lg" />
      <CourseFilters />
    </>
  );
};

export default Page;
