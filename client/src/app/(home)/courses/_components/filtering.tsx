"use client";

import React, { useEffect, useRef, useState } from "react";
import { categories, cn } from "@/lib/utils";

// not a real category, picking it just clears the filter
export const ALL_CATEGORIES = "All Recommendations";

const studyFields = [ALL_CATEGORIES, ...categories];

export const Filtering = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) => {
  const row = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  // where the pointer went down, so a move can be turned into a scroll offset
  const origin = useRef({ x: 0, scrollLeft: 0 });
  const moved = useRef(false);

  function startDrag(event: React.MouseEvent<HTMLDivElement>) {
    const el = row.current;
    if (!el || event.button !== 0) return;

    origin.current = { x: event.pageX, scrollLeft: el.scrollLeft };
    moved.current = false;
    setDragging(true);
  }

  // a drag ends with a click on whichever chip is under the cursor, which would
  // otherwise select it. capture the click before it reaches the button
  function swallowDragClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!moved.current) return;
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    const el = row.current;
    if (!dragging || !el) return;

    const onMove = (event: MouseEvent) => {
      const distance = event.pageX - origin.current.x;
      if (Math.abs(distance) > 4) moved.current = true;
      el.scrollLeft = origin.current.scrollLeft - distance;
    };
    const onUp = () => setDragging(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return (
    <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto md:pt-40 pt-4">
      <div
        ref={row}
        onMouseDown={startDrag}
        onClickCapture={swallowDragClick}
        className={cn(
          "flex items-center justify-start gap-4 flex-nowrap overflow-x-auto scrollbar-hide select-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {studyFields.map((field) => (
          <button
            key={field}
            type="button"
            onClick={() => onSelect(field)}
            className={cn(
              "text-nowrap rounded-[12px] font-poppins py-2 px-4 border-1 border-[#3DCBB1] cursor-pointer",
              field === selected
                ? "bg-[#3DCBB1] text-white"
                : "bg-popover text-popover-foreground/60",
            )}
          >
            {field}
          </button>
        ))}
      </div>
    </section>
  );
};
