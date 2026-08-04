import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Crumb {
  label: string;
  // the crumb for the current page is the one without a link
  href?: string;
}

// The band that sits under the fixed nav and names the page. It runs on the
// secondary surface rather than a fixed dark, so it follows the theme: a pale
// band on white in light mode, a raised grey one in dark. The bottom border is
// what keeps it legible in light mode, where the surface is close to the page.
export function PageHeader({
  title,
  breadcrumbs = [],
  subtitle,
}: {
  title: string;
  breadcrumbs?: Crumb[];
  subtitle?: string;
}) {
  return (
    <div className="mt-[var(--margin-section-top)] border-b border-border bg-secondary py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-outfit text-3xl font-bold text-secondary-foreground">
          {title}
        </h1>

        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-secondary-foreground"
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

        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
