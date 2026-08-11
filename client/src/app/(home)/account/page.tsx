import Link from "next/link";
import { getUserSession } from "@/actions/authentication";
import { getWishlistAction } from "@/actions/wishlist";
import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import { UserSession } from "@/util/interfaces";
import { CourseList } from "../my-learning/_components/course-list";
import Tabs, { Tab } from "../my-learning/_components/tabs";
import { getEnrolledCourses, getInstructorProfile } from "./action";
import AccountTab from "./_components/AccountTab";
import BecomeInstructorTab from "./_components/BecomeInstructorTab";
import InstructorProfileSummary from "./_components/InstructorProfileSummary";
import WishlistTab from "./_components/WishlistTab";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const userSession: UserSession | null = await getUserSession();
  const { image } = userSession ?? {};
  const param = (await searchParams).tab || "Account";
  const tab = param as Tab;
  const isInstructor = userSession?.roles?.includes("instructor") ?? false;
  // instructors keep the tab, it just turns into a read only summary
  const instructor =
    isInstructor && tab === "Become an Instructor"
      ? await getInstructorProfile()
      : null;
  const courses = tab === "Courses" ? await getEnrolledCourses() : null;
  const wishlist = tab === "Wishlist" ? await getWishlistAction() : null;

  return (
    <div className="container max-w-7xl mx-auto px-4 mt-[var(--margin-section-top)]">
      {/* navigation */}
      <NavigationFixed />
      <MobileNavigation />
      {/* title */}
      <h1 className="py-3 lg:py-0 text-2xl font-bold text-center text-popover-foreground">
        My Account
      </h1>
      {/* tabs -- this component will be a reusable component */}
      <Tabs
        tab={tab}
        hide={userSession ? [] : ["Become an Instructor"]}
        labels={
          isInstructor ? { "Become an Instructor": "Instructor Profile" } : {}
        }
      >
        {tab === "Account" && (
          <AccountTab image={image} userSession={userSession} />
        )}
        {tab === "Become an Instructor" &&
          (!userSession ? (
            <p className="text-center text-muted-foreground mt-10">
              Sign in to register as an instructor.
            </p>
          ) : !isInstructor ? (
            <BecomeInstructorTab />
          ) : instructor ? (
            <InstructorProfileSummary instructor={instructor} />
          ) : (
            <p className="text-center text-muted-foreground mt-10">
              We could not load your instructor profile right now. Please try
              again later.
            </p>
          ))}
        {tab === "Courses" &&
          (courses === null ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                We couldn&apos;t load your courses right now.
              </p>
              <Link
                href="/auth/login"
                className="text-primary hover:underline text-sm mt-2 inline-block"
              >
                Sign in to see your learning
              </Link>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                You have no enrolled courses yet.
              </p>
              <Link
                href="/courses"
                className="text-primary hover:underline text-sm mt-2 inline-block"
              >
                Browse courses
              </Link>
            </div>
          ) : (
            <div className="px-4 py-6">
              <CourseList courses={courses} />
            </div>
          ))}
        {tab === "Wishlist" && <WishlistTab items={wishlist} />}
        {(tab === "Completed" || tab === "In Progress") && (
          <p className="text-center text-muted-foreground mt-10">
            This functionality is not implemented yet.
          </p>
        )}
      </Tabs>
    </div>
  );
}
