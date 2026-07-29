import { ReactNode } from "react";

// shared shell for the not-found and error screens
export function StatusScreen({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4 font-poppins">
      <p className="text-[110px] leading-none font-bold text-primary/20 select-none">
        {code}
      </p>
      <h1 className="text-2xl font-bold text-popover-foreground mt-2">
        {title}
      </h1>
      <p className="text-sm text-popover-foreground/50 mt-3 max-w-[420px] leading-6">
        {description}
      </p>
      {children ? (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {children}
        </div>
      ) : null}
    </section>
  );
}
