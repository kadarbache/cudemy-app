import { getUserSession } from "@/actions/authentication";
import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import { UserSession } from "@/util/interfaces";
import Tabs, { Tab } from "../my-learning/_components/tabs";
import { getInstructorProfile } from "./action";
import AccountTab from "./_components/AccountTab";
import BecomeInstructorTab from "./_components/BecomeInstructorTab";
import InstructorProfileSummary from "./_components/InstructorProfileSummary";

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
      />
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
    </div>
  );
}
