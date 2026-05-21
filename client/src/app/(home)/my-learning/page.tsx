import Footer from "@/components/footer";
import { NavigationFixed } from "@/components/navigation";
import { Card } from "./_components/card";

const Page = () => {
  return (
    <>
      <NavigationFixed />
      <div className="container mx-auto mt-[var(--margin-section-top)]">
        <h1 className="py-3 lg:py-0 text-2xl font-bold text-center text-popover-foreground">
          My Learning
        </h1>
        {/* navigation tabs */}
        {/* <Tabs tab="Courses" /> */}
        <p className="text-center text-popover-foreground/50 mt-2 px-4">
          Here you can find your enrolled courses and track your progress.
        </p>
        {/* Add your content here */}
      </div>
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-xl font-semibold">Enrolled Courses</h2>
        <p className="text-start text-popover-foreground/50">
          List of your courses
        </p>
        {/* List of enrolled courses will go here */}
        {Card ? (
          <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card />
            </div>
          </section>
        ) : (
          <p className="text-center text-popover-foreground/50">
            You have no enrolled courses yet.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
