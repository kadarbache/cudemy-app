"use client";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

// Define the type for the tabs
export type Tab =
  | "Account"
  | "Become an Instructor"
  | "Courses"
  | "Wishlist"
  | "Completed"
  | "In Progress";

export default function Tabs({
  tab,
  hide = [],
  labels = {},
  children,
}: {
  tab: Tab;
  hide?: Tab[];
  // the search param stays the same, only the button copy changes
  labels?: Partial<Record<Tab, string>>;
  // the tab body, swapped for a spinner while the next one is on its way
  children?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(tab);
  // the body is rendered on the server, so a tab click waits on a round trip.
  // without this the strip highlights instantly and nothing else moves, which
  // reads as a frozen page
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTabChange(tab: Tab) {
    console.log("tab", tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setActiveTab(tab);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const allTabs: Tab[] = [
    "Account",
    "Become an Instructor",
    "Courses",
    "Wishlist",
    "Completed",
    "In Progress",
  ];
  const tabs = allTabs.filter((tab) => !hide.includes(tab));

  return (
    <>
      <nav className="border-b md:border-none">
        <div className="flex items-center md:justify-center overflow-x-auto scrollbar-hide px-4 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-4 px-1 whitespace-nowrap text-sm font-medium transition-colors relative flex-shrink-0 ${
                activeTab === tab
                  ? "text-teal-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels[tab] ?? tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </nav>
      {isPending ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
