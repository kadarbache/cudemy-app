import Link from "next/link";
import { NavigationFixed } from "@/components/navigation";
import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui/button";

// shown when a student facing page calls notFound(), eg. an unknown course id
export default function NotFound() {
  return (
    <>
      <NavigationFixed />
      <div className="mt-[var(--margin-section-top)]">
        <StatusScreen
          code="404"
          title="We could not find that"
          description="This course is no longer available, or the link you followed is not correct."
        >
          <Button asChild size="md">
            <Link href="/courses">Browse courses</Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href="/my-learning">My learning</Link>
          </Button>
        </StatusScreen>
      </div>
    </>
  );
}
