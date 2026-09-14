"use client";

import { usePathname, useSearchParams } from "next/navigation";

export type AuthDialog = "login" | "signup";

// Drives the login and signup dialogs off ?auth= so the url is the single
// source of truth: sharing the link opens the dialog, back closes it.
export function useAuthDialog(dialog: AuthDialog) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const open = searchParams.get("auth") === dialog;

  // the page to come back to once a submit goes through, with ?auth= dropped.
  // the server cannot work this out on its own, so the form carries it
  const params = new URLSearchParams(searchParams);
  params.delete("auth");
  const cleanQuery = params.toString();
  const returnTo = cleanQuery ? `${pathname}?${cleanQuery}` : pathname;

  function onOpenChange(next: boolean) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("auth", dialog);
    else params.delete("auth");

    const query = params.toString();
    // shallow on purpose. router.push would refetch the whole server tree just
    // to toggle a dialog, which is the lag you feel before it opens
    window.history.pushState(null, "", query ? `${pathname}?${query}` : pathname);
  }

  return { open, onOpenChange, returnTo };
}
