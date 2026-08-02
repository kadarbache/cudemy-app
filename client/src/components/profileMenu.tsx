"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { signOutAction } from "@/actions/authentication";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSession } from "@/util/interfaces";

export function ProfileMenu({
  userSession,
  className,
}: {
  userSession: UserSession;
  className?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await signOutAction();
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["userSession"] });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className={`rounded-full cursor-pointer disabled:opacity-50 ${className ?? ""}`}
        >
          <Image
            src={
              !userSession.image || userSession.image === "default.png"
                ? "/assets/default.png"
                : userSession.image
            }
            alt="User Image"
            width={36}
            height={36}
            className="rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
