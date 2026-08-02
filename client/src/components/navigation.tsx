"use client";
import Cart from "../../public/assets/Cart.svg";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserSession } from "@/actions/authentication";
import { UserSession } from "@/util/interfaces";
import Browse from "@/components/browse";
import { SearchDialog } from "@/components/search-dialog";
import { SigninButton } from "@/components/signinButton";
import { SignupButton } from "@/components/singupButton";
import { ProfileMenu } from "@/components/profileMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

export const Navigation = ({
  userSession,
}: {
  userSession: UserSession | null;
}) => {
  return (
    <section className="hidden md:flex w-full my-5 container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex w-full items-center justify-between ">
        <div className="flex items-center gap-12">
          <Link href="#">
            <Image
              src="/assets/logo.png"
              alt="Cudemy"
              width={179}
              height={34}
              priority
            />
          </Link>
          <Browse userSession={userSession} />
        </div>
        {userSession ? (
          <div className="flex items-center gap-3">
            <Link href="/my-learning">
              <button className="text-white hover:text-white/60 transition-all cursor-pointer">
                my learning
              </button>
            </Link>
            <div>
              <ThemeToggle />
              <button className="p-2 md:hover:bg-popover/7 hover:cursor-pointer  rounded-md transition-colors group">
                <Cart className="" />
              </button>
            </div>
            <ProfileMenu userSession={userSession} />
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <SigninButton />
            <SignupButton />
          </div>
        )}
      </div>
    </section>
  );
};

export const NavigationFixed = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isPending, data } = useQuery({
    queryKey: ["userSession"],
    queryFn: () => getUserSession(),
  });

  // makes the Ctrl K hint shown in the search bar actually work
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-popover shadow-[var(--shadow-search-bar)] py-4 px-2">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Cudemy"
              width={179}
              height={34}
              priority
            />
          </Link>
          <button className="items-center text-[var(--primary-color)] font-poppins text-[16px] not-italic font-normal leading-[21px] bg-transparent cursor-pointer hover:text-[var(--primary-color)]/70 transition-all hidden">
            <span>Browse</span>
            <ChevronRight />
          </button>
        </div>
        {/* searchBar */}
        <div className="hidden lg:flex items-center gap-5 relative">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="py-3 px-12 rounded-[8px] text-start bg-popover/90 text-popover-foreground/30 font-poppins text-sm font-normal leading-[21px] w-[500px] h-[42px] border-1 border-[var(--primary-color)] cursor-pointer"
          >
            Search keywords
          </button>
          <Search className="text-[var(--primary-color)] absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 pointer-events-none" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-popover-foreground/15 bg-popover px-1.5 py-0.5 text-[10px] font-medium text-popover-foreground/40 pointer-events-none">
            Ctrl K
          </kbd>
        </div>
        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        {/* Auth-Buttons */}
        {data || isPending ? (
          <div className="flex items-center gap-5">
            <Link href="/my-learning">
              <button className="text-popover-foreground hover:text-popover-foreground/70 transition-all cursor-pointer">
                my learning
              </button>
            </Link>
            <ThemeToggle />
            <div className="p-2 hover:bg-popover-foreground/7 rounded-md">
              <Cart className="cursor-pointer" />
            </div>
            {isPending || !data ? (
              <Skeleton className="h-[36px] w-[36px] rounded-full" />
            ) : (
              <ProfileMenu userSession={data} className="w-9 h-9" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <SigninButton />
            <SignupButton />
          </div>
        )}
      </div>
    </section>
  );
};
