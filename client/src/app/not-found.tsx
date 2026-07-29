import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { StatusScreen } from "@/components/status-screen";
import { ThemeProvider } from "@/components/theme-provider";
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

export const metadata: Metadata = {
  title: "Page not found | Cudemy",
};

// routes that match no route group land here, so this renders its own document
export default function NotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${PoppinsFont.variable} ${OutfitFont.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <StatusScreen
            code="404"
            title="This page does not exist"
            description="The page you are looking for was moved, removed or never existed in the first place."
          >
            <Button asChild size="md">
              <Link href="/courses">Browse courses</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/my-learning">My learning</Link>
            </Button>
          </StatusScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
