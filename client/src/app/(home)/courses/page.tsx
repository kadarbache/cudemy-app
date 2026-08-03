import { CourseCatalog } from "@/app/(home)/courses/_components/course-catalog";
import { Banner } from "@/components/banner";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import MobileHero from "@/components/mobile-hero";
import MobileNavigation from "@/components/mobileNavigation";
import { getUserSession } from "@/actions/authentication";
import { apiRoutes } from "@/lib/apiRoutes";
import { PUBLIC_COURSE_REVALIDATE, cacheTags } from "@/lib/cacheTags";

const Page = async function () {
  const data = await fetch(apiRoutes.courses.getAllCourses, {
    next: {
      revalidate: PUBLIC_COURSE_REVALIDATE,
      // the feed shows the instructor name, so it goes stale with their profile
      tags: [cacheTags.coursesList, cacheTags.instructorProfiles],
    },
  });

  const userSession = await getUserSession();

  const response = await data.json();
  if (!data.ok) {
    console.error("Failed to fetch courses:", data.statusText);
    return null;
  }

  const courses = response.data.courses;
  return (
    <>
      <Banner />
      <MobileNavigation />
      <Hero userSession={userSession} />
      <MobileHero />
      <CourseCatalog data={courses} />
      <Footer />
    </>
  );
};

export default Page;
