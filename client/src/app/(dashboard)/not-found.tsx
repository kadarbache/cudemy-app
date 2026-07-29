import Link from "next/link";
import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui/button";

// shown when a dashboard page calls notFound(), eg. editing a course you do not own
export default function NotFound() {
  return (
    <main className="w-full bg-background">
      <StatusScreen
        code="404"
        title="We could not find that"
        description="This course does not exist, or it is not one of yours to manage."
      >
        <Button asChild size="md">
          <Link href="/manage-courses">My courses</Link>
        </Button>
        <Button asChild variant="outline" size="md">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </StatusScreen>
    </main>
  );
}
