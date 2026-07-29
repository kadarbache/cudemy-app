"use client";

import { Outfit, Poppins } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";
import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui/button";

const PoppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const OutfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// last resort boundary, it catches errors thrown by the root layouts themselves
// so it deliberately renders its own document without the theme provider
export default function GlobalError({
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
    <html lang="en">
      <body
        className={`${PoppinsFont.variable} ${OutfitFont.variable} antialiased`}
      >
        <StatusScreen
          code="500"
          title="Something went wrong"
          description="The application failed to load. Try again, and if the problem keeps happening reload the page."
        >
          <Button size="md" onClick={reset}>
            Try again
          </Button>
        </StatusScreen>
        {error.digest ? (
          <p className="text-center text-xs text-popover-foreground/30 font-poppins pb-8">
            Error ID: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
