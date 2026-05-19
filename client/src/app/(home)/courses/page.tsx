import { Feed } from "@/app/(home)/courses/_components/feed";
import { Filtering } from "@/app/(home)/courses/_components/filtering";
import { Banner } from "@/components/banner";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import MobileHero from "@/components/mobile-hero";
import MobileNavigation from "@/components/mobileNavigation";
import { apiRoutes } from "@/lib/apiRoutes";
import { cookies } from "next/dist/server/request/cookies";

const Page = async function () {
  const data = await fetch(apiRoutes.courses.getAllCourses, {
    next: {
      revalidate: 60,
    },
  });

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let userSession;
  const userSessionResponse = await fetch(apiRoutes.user.getUserSession, {
    headers: { Cookie: cookieHeader },
    credentials: "include",
    next: {
      revalidate: 60,
    },
  });

  if (!userSessionResponse.ok) userSession = null;
  else {
    const userSessionData = await userSessionResponse.json();
    userSession = userSessionData.data.user;
    console.log("user session", userSession);
  }

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
      <Filtering />
      <Feed data={courses} />
      <Footer />
    </>
  );
};

export default Page;
