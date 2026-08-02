"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Define the type for the tabs
export type Tab =
  | "Account"
  | "Become an Instructor"
  | "Courses"
  | "Wishlist"
  | "Completed"
  | "In Progress"
  | "Archived";

export default function Tabs({
  tab,
  hide = [],
  labels = {},
}: {
  tab: Tab;
  hide?: Tab[];
  // the search param stays the same, only the button copy changes
  labels?: Partial<Record<Tab, string>>;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(tab);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTabChange(tab: Tab) {
    console.log("tab", tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
    setActiveTab(tab);
  }

  const allTabs: Tab[] = [
    "Account",
    "Become an Instructor",
    "Courses",
    "Wishlist",
    "Completed",
    "In Progress",
    "Archived",
  ];
  const tabs = allTabs.filter((tab) => !hide.includes(tab));

  return (
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
  );
}
