"use client";

import Link from "next/link";
import { useEffect } from "react";
import { NavigationFixed } from "@/components/navigation";
import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <NavigationFixed />
      <div className="mt-[var(--margin-section-top)]">
        <StatusScreen
          code="500"
          title="Something went wrong"
          description="We could not load this page. Try again, or head back to the courses while we sort it out."
        >
          <Button size="md" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/courses">Browse courses</Link>
          </Button>
        </StatusScreen>
        {error.digest ? (
          <p className="text-center text-xs text-popover-foreground/30 font-poppins pb-8">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
    </>
  );
}
