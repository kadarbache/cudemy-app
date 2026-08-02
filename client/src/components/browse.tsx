import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { UserSession } from "@/util/interfaces";

export default function Browse({
  userSession,
}: {
  userSession: UserSession | null;
}) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem className="bg:transparent">
          <NavigationMenuTrigger className="flex items-center text-[var(--primary-color)] font-poppins text-[16px] not-italic font-normal leading-[21px] bg-transparent cursor-pointer hover:bg-transparent hover:text-[var(--primary-color)]/70 transition-all">
            Browse
          </NavigationMenuTrigger>
          <NavigationMenuContent className="backdrop-blur-2xl">
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 mb-2">
                      <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        width={179}
                        height={34}
                        className="-translate-x-5"
                      />
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Elearning platform for students and professionals.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/how-things-work" title="How Things Work">
                Understand the structure and features
              </ListItem>
              {userSession && !userSession.roles?.includes("instructor") && (
                <ListItem
                  href="/account?tab=Become%20an%20Instructor"
                  title="Be an Instructor"
                >
                  Information on becoming a teacher
                </ListItem>
              )}
              <ListItem href="/learning-paths" title="Learning Paths">
                Structured collections of courses
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild className="">
        <Link href={href}>
          <div className="text-primary text-sm leading-none font-medium">
            {title}
          </div>
          <p className="text-white/70 line-clamp-2 text-sm leading-snug group-hover:text-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
