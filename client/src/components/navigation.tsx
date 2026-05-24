"use client";
import Cart from "../../public/assets/Cart.svg";
import LogoNav from "../../public/assets/logoNav.svg";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUserSession } from "@/actions/authentication";
import { UserSession } from "@/util/interfaces";
import Browse from "@/components/browse";
import { SigninButton } from "@/components/signinButton";
import { SignupButton } from "@/components/singupButton";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

import SearchBar from "@/components/searchBar";

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
            <LogoNav />
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
            <Link href="/account">
              <Image
                src={
                  userSession.image === "default.png"
                    ? "/assets/default.png"
                    : userSession.image || "/assets/default.png"
                }
                alt="User Image"
                width={36}
                height={36}
                className="rounded-full"
              />
            </Link>
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
  const { isPending, data } = useQuery({
    queryKey: ["userSession"],
    queryFn: () => getUserSession(),
  });

  return (
    <section className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-popover shadow-[var(--shadow-search-bar)] py-4 px-2">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/">
            <LogoNav />
          </Link>
          <button className="items-center text-[var(--primary-color)] font-poppins text-[16px] not-italic font-normal leading-[21px] bg-transparent cursor-pointer hover:text-[var(--primary-color)]/70 transition-all hidden">
            <span>Browse</span>
            <ChevronRight />
          </button>
        </div>
        {/* searchBar */}
        <SearchBar />
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
            <Avatar asChild className="w-9 h-9">
              {isPending ? (
                <Skeleton className="h-[36px] w-[36px] rounded-full" />
              ) : (
                <Image
                  src={data?.image === "default.png" ? "/assets/default.png" : (data?.image || "/assets/default.png")}
                  alt="User Image"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
            </Avatar>
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
