"use client";

import Cart from "@/../public/assets/Cart.svg";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserSession } from "@/actions/authentication";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LessonNav({ courseId }: { courseId: string }) {
  const { isPending, data } = useQuery({
    queryKey: ["userSession"],
    queryFn: () => getUserSession(),
  });
  const router = useRouter();

  return (
    <nav className="flex items-center gap-5 px-8 py-3.5 border-b border-popover-foreground/10">
      <button
        onClick={() => router.push(`/courses/${courseId}`)}
        aria-label="Back to course"
        className="cursor-pointer text-popover-foreground/60 hover:text-popover-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 max-w-[500px] relative">
        <Input
          type="text"
          placeholder="Search keywords"
          className="w-full py-3 px-12 rounded-lg border-primary placeholder:text-popover-foreground/30"
        />
        <Search className="w-4 h-4 text-primary absolute left-4 top-1/2 -translate-y-1/2" />
      </div>
      <div className="ml-auto flex items-center gap-[18px] text-sm">
        <Link href="/my-learning">
          <span className="hover:text-popover-foreground/70 transition-colors cursor-pointer">
            my learning
          </span>
        </Link>
        <ThemeToggle />
        <button className="p-2 hover:bg-popover-foreground/7 rounded-md transition-colors">
          <Cart />
        </button>
        {isPending ? (
          <Skeleton className="h-7 w-7 rounded-full" />
        ) : (
          <Link href="/account">
            <Image
              src={
                data?.image === "default.png"
                  ? "/assets/default.png"
                  : data?.image || "/assets/default.png"
              }
              alt="User Image"
              width={28}
              height={28}
              className="rounded-full"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
