import { getUserSession } from "@/actions/authentication";
import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import { UserSession } from "@/util/interfaces";
import Tabs, { Tab } from "../my-learning/_components/tabs";
import AccountTab from "./_components/AccountTab";

export default async function page({
  searchParams,
}: {
  searchParams: { tab: Tab };
}) {
  const userSession: UserSession | null = await getUserSession();
  const { image } = userSession ?? {};
  const tab = searchParams.tab || "Account";
  console.log(tab);
  console.log(image);
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
      <Tabs tab={tab} />
      {tab === "Account" && (
        <AccountTab image={image} userSession={userSession} />
      )}
    </div>
  );
}
