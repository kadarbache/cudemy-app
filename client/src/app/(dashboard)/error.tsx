"use client";

import Link from "next/link";
import { useEffect } from "react";
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
    <main className="w-full bg-background">
      <StatusScreen
        code="500"
        title="Something went wrong"
        description="We could not load this part of your dashboard. Try again, or go back to your courses."
      >
        <Button size="md" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="md">
          <Link href="/manage-courses">My courses</Link>
        </Button>
      </StatusScreen>
      {error.digest ? (
        <p className="text-center text-xs text-muted-foreground font-poppins pb-8">
          Error ID: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
