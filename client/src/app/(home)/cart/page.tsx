import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Footer from "@/components/footer";
import MobileNavigation from "@/components/mobileNavigation";
import { NavigationFixed } from "@/components/navigation";
import { PageHeader } from "@/components/page-header";
import { getCartAction } from "@/actions/cart";
import { getWishlistAction } from "@/actions/wishlist";
import { getAllCourses } from "@/lib/courses";
import { CartRow } from "./_components/cart-row";
import { CartSummary } from "./_components/cart-summary";
import { Recommendations } from "./_components/recommendations";
import { WishlistPanel } from "./_components/wishlist-panel";

const Page = async () => {
  // independent, so don't make one wait on the other
  const [items, catalogue, wishlist] = await Promise.all([
    getCartAction(),
    getAllCourses(),
    getWishlistAction(),
  ]);

  const cartCourseIds = new Set(items?.map((item) => item.courseId));
  const suggestions = catalogue
    .filter((course) => !cartCourseIds.has(course.id))
    .slice(0, 4);

  return (
    // min-h-screen + flex-1 on the content keeps the footer at the bottom
    // instead of leaving background below it on a short cart
    <div className="flex min-h-screen flex-col">
      <MobileNavigation />
      <NavigationFixed />

      <PageHeader
        title="Shopping Cart"
        breadcrumbs={[{ label: "Courses", href: "/courses" }, { label: "Cart" }]}
      />

      <section className="container mx-auto max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {items === null ? (
          <div className="py-16 text-center">
            <p className="text-popover-foreground/60">
              We couldn&apos;t load your cart right now.
            </p>
            <Link
              href="/auth/login"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Sign in to see your cart
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-popover-foreground/60">Your cart is empty.</p>
            <Link
              href="/courses"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* one panel of divided rows, not a stack of separate cards */}
              <div className="overflow-hidden rounded-lg border-1 border-popover-foreground/10 bg-card">
                <div className="flex items-center gap-2 border-b border-popover-foreground/10 px-4 py-4 sm:px-5">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="text-sm font-medium text-popover-foreground">
                    {items.length} {items.length === 1 ? "course" : "courses"}{" "}
                    in your cart
                  </h2>
                </div>
                <div className="divide-y divide-popover-foreground/10">
                  {items.map((item) => (
                    <CartRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <WishlistPanel items={wishlist ?? []} />
            </div>
            <CartSummary items={items} />
          </div>
        )}

        <Recommendations courses={suggestions} />
      </section>
      <Footer />
    </div>
  );
};

export default Page;
