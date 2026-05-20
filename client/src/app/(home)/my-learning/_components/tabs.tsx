"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Define the type for the tabs
export type Tab =
  | "Account"
  | "Courses"
  | "Wishlist"
  | "Completed"
  | "In Progress"
  | "Archived";

export default function Tabs({ tab }: { tab?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>((tab as Tab) || "Account");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTabChange(tab: Tab) {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
    setActiveTab(tab);
  }

  const tabs: Tab[] = [
    "Account",
    "Courses",
    "Wishlist",
    "Completed",
    "In Progress",
    "Archived",
  ];

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
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
