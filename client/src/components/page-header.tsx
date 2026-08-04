import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Crumb {
  label: string;
  // the crumb for the current page is the one without a link
  href?: string;
}

// The dark band that sits under the fixed nav and names the page. Same dark as
// the footer, so a page is bookended by it.
export function PageHeader({
  title,
  breadcrumbs = [],
}: {
  title: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <div className="mt-[var(--margin-section-top)] bg-[#1B1B1B] py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-outfit text-3xl font-bold text-white">{title}</h1>

        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mt-1 flex flex-wrap items-center gap-1 text-sm text-gray-400"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
