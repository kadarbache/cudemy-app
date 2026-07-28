import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SelectDemoProps {
  selectItems?: string[];
  selectLabel?: string;
  selectPlaceholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
  defaultValue?: string;
}

export function SelectInput({
  selectItems,
  selectLabel,
  selectPlaceholder,
  className,
  required,
  name,
  defaultValue,
}: SelectDemoProps) {
  return (
    <Select required={required} name={name} defaultValue={defaultValue}>
      <SelectTrigger
        size="lg"
        className={`bg-popover-foreground/10 w-[248px] max-w-md p-4 h-[56px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-popover-foreground/70 font-poppins text-[16px] font-normal leading-[24px] border-none ${className}`}
      >
        <SelectValue placeholder={selectPlaceholder} className="" />
      </SelectTrigger>
      <SelectContent className="bg-[var(--input-bg-color)] text-[var(--input-text-color)] font-poppins text-[16px] font-normal leading-[24px]">
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {selectItems?.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const HeroSearchBar = () => {
  return (
    <div className="hidden absolute container mx-auto md:flex flex-col gap-4 p-8 justify-center bottom-0 translate-y-1/2 bg-popover rounded-3xl shadow-[var(--shadow-search-bar)] max-w-5xl">
      <h1 className="text-popover-foreground font-poppins text-xl not-italic font-bold leading-[30px]">
        What do you want to learn?
      </h1>

      {/* inputs and button */}
      <div className="flex items-center justify-center gap-2">
        <Input type="text" placeholder="Find courses, skills, software, etc" />
        <SelectInput
          selectItems={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
          selectLabel="Categories"
          selectPlaceholder="Select a Category"
        />
        <Button size="lg" variant="primary">
          <Link href="/" className="px-4">
            Search
          </Link>
        </Button>
      </div>
    </div>
  );
};
