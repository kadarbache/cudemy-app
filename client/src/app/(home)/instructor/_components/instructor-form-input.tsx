import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import React from "react";
import { SelectInput } from "../../courses/_components/heroSearchBar";
import { useRegisterInstructorContext } from "./registerInstructorContext";
import { CheckedState } from "@radix-ui/react-checkbox";

type InputProps<T extends object> = {
  type: string;
  placeholder?: string;
  description: string;
  setSelected?: React.Dispatch<React.SetStateAction<T>>;
  inputValue?: string | number;
  name: string;
  min?: number;
  max?: number;
};

type InputSelectProps = {
  selectItems: string[];
  selectLabel: string;
  selectPlaceholder: string;
  multiple?: boolean;
};
type InputCheckboxProps = {
  checkboxId: string;
  label: string;
  paragraph?: string;
  selectedOption: boolean;
  onhandleSelectionChange: (field: string, value: boolean) => void;
};

export function InstructorFormInput<T extends object>({
  type,
  setSelected,
  placeholder,
  description,
  name,
  inputValue,
  min,
  max,
}: InputProps<T>) {
  const { updateRegisterDataForm } = useRegisterInstructorContext();
  return (
    <>
      <Label className="w-[80%]">{description}</Label>
      <input
        type={type}
        name={name}
        id={name}
        value={inputValue ? inputValue : ""}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (setSelected) {
            setSelected((prev) => ({
              ...prev,
              [name]: e.target.value,
            }) as unknown as T);

            updateRegisterDataForm(
              type === "number"
                ? { [name]: Number(e.target.value) }
                : { [name]: e.target.value },
            );
          }
        }}
        className={clsx(
          "bg-[var(--input-bg-color)] w-full max-w-xl p-4 rounded-lg outline-none ring-2 ring-[var(--primary-color)] text-[var(--input-text-color)] font-poppins text-[16px] font-normal leading-[24px] placeholder:overflow-hidden",
        )}
      />
    </>
  );
}

export function InstructorFormSelect({
  selectItems,
  selectLabel,
  selectPlaceholder,
}: InputSelectProps) {
  return (
    <SelectInput
      className="w-full max-w-full"
      selectItems={selectItems}
      selectLabel={selectLabel}
      selectPlaceholder={selectPlaceholder}
    />
  );
}

export function InstructorFormCheckbox({
  checkboxId,
  label,
  paragraph,
  selectedOption,
  onhandleSelectionChange,
}: InputCheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="hidden"
        name={checkboxId}
        value={selectedOption.toString()}
      />
      <Checkbox
        id={checkboxId}
        className="h-6 w-6 border-1 border-primary cursor-pointer"
        required
        checked={selectedOption}
        onCheckedChange={(checked: CheckedState) => {
          onhandleSelectionChange(checkboxId, checked === true);
        }}
      />
      <div className="grid gap-2">
        <Label htmlFor={checkboxId}>{label}</Label>
        {paragraph && (
          <p className="text-muted-foreground text-sm">{paragraph}</p>
        )}
      </div>
    </div>
  );
}
