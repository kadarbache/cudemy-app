"use client";

import {
  Search,
  Menu,
  X,
  BookOpenIcon,
  BadgeCheckIcon,
  CompassIcon,
  PresentationIcon,
  RouteIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useTransition } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CartButton } from "./cart-button";
import { getUserSession, signOutAction } from "../actions/authentication";
import { UserSession } from "../util/interfaces";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

type NavLinkRow = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export default function MobileNavigation({
  hideFrom = "md",
}: {
  hideFrom?: "md" | "lg";
}) {
  const hiddenClass = hideFrom === "lg" ? "lg:hidden" : "md:hidden";

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [userSession, setUserSession] = React.useState<UserSession | null>(
    null,
  );
  const [isLoggingOut, startLogout] = useTransition();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getUserSession();
      setUserSession(session);
    };
    fetchSession();
  }, []);

  // keep the page behind the drawer from scrolling while it's open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    startLogout(async () => {
      const result = await signOutAction();
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["userSession"] });
      router.push("/");
      router.refresh();
    });
  };

  const primaryRows: NavLinkRow[] = [];
  if (userSession) {
    primaryRows.push(
      { href: "/my-learning", label: "My Learning", icon: BookOpenIcon },
      { href: "/account", label: "Account", icon: BadgeCheckIcon },
    );
  }
  primaryRows.push({
    href: "/how-things-work",
    label: "How Things Work",
    icon: CompassIcon,
  });
  if (userSession && !userSession.roles?.includes("instructor")) {
    primaryRows.push({
      href: "/account?tab=Become%20an%20Instructor",
      label: "Be an Instructor",
      icon: PresentationIcon,
    });
  }
  primaryRows.push({
    href: "/learning-paths",
    label: "Learning Paths",
    icon: RouteIcon,
  });

  return (
    <>
      <div
        className={`${hiddenClass} fixed top-0 left-0 right-0 z-10 bg-popover shadow-[var(--shadow-search-bar)] py-4 px-4`}
      >
        <div className="container mx-auto flex items-center justify-between w-full">
          <div className="flex items-center justify-between w-full">
            <div className="p-2 hover:bg-popover-foreground/7 rounded-md">
              <Menu
                size={20}
                className="text-[var(--primary-color)]"
                onClick={toggleMenu}
              />
            </div>
            <Link href="/" className="">
              <Image
                src="/assets/logo.png"
                alt="Cudemy"
                width={179}
                height={34}
                priority
              />
            </Link>
            {/* Auth-Buttons */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="p-2 hover:bg-popover-foreground/7 rounded-md">
                <Search
                  size={20}
                  className="text-[var(--primary-color)]"
                  onClick={() => setIsSearchOpen(true)}
                />
              </div>
              <CartButton />
            </div>
          </div>
        </div>
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      {/* Overlay */}
      <div
        className={`bg-popover/5 backdrop-blur-xl ${hiddenClass} z-[90] flex h-screen w-full right-0 top-0 fixed ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-opacity duration-500`}
      >
        {/* Slide-in navigation panel */}
        <div
          className={`bg-popover ${hiddenClass} z-[95] flex h-screen w-[70%] left-0 top-0 fixed overflow-clip
        transition-transform duration-500
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col h-full w-full">
            {/* panel header: logo + close */}
            <div className="flex-none flex items-center justify-between px-4 py-4 border-b border-popover-foreground/10">
              <Image
                src="/assets/logo.png"
                alt="Cudemy"
                width={140}
                height={27}
              />
              <button
                type="button"
                onClick={toggleMenu}
                aria-label="Close menu"
                className="p-2 hover:bg-popover-foreground/7 rounded-full"
              >
                <X size={18} className="text-[var(--primary-color)]" />
              </button>
            </div>

            {/* navigation links */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
              <div className="flex flex-col gap-1">
                {primaryRows.map((row) => {
                  const isActive = pathname === row.href.split("?")[0];
                  return (
                    <Link
                      key={row.label}
                      href={row.href}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                        isActive
                          ? "bg-[var(--primary-color)]/10 font-medium text-popover-foreground"
                          : "text-popover-foreground hover:bg-popover-foreground/7"
                      }`}
                    >
                      <row.icon
                        size={20}
                        className="text-[var(--primary-color)]"
                      />
                      <span>{row.label}</span>
                    </Link>
                  );
                })}
              </div>

              {userSession && (
                <div className="mt-4 border-t border-popover-foreground/10 pt-4">
                  <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-popover-foreground transition-colors hover:bg-popover-foreground/7 disabled:opacity-50"
                  >
                    <LogOutIcon size={20} className="text-[var(--primary-color)]" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* bottom profile / auth area */}
            <div className="flex-none border-t border-popover-foreground/10 p-4">
              {userSession ? (
                <div className="flex items-center gap-3 rounded-xl border border-popover-foreground/10 px-3 py-2">
                  <div className="relative h-9 w-9 flex-none overflow-hidden rounded-full">
                    <Image
                      src={
                        !userSession.image ||
                        userSession.image === "default.png"
                          ? "/assets/default.png"
                          : userSession.image
                      }
                      alt="User Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="truncate text-sm font-medium text-popover-foreground">
                    {userSession.name}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login" onClick={toggleMenu} className="flex-1">
                    <Button variant="outline" size="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={toggleMenu} className="flex-1">
                    <Button variant="primary" size="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
