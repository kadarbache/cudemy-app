"use server";

import z from "zod";
import { formatZodErrors, stepOneSchema, stepTwoSchema } from "./zodTypes";

interface ObjType {
  label: string;
  value: string;
  category: string;
}

function formatSelectOptions(obj: FormDataEntryValue[]): string[] {
  // 1. Safely retrieve the first string from the array
  const jsonStr = obj[0];
  if (typeof jsonStr !== "string") return [];

  // 2. Parse and cast the result to ObjType[]
  const deserialised = JSON.parse(jsonStr) as ObjType[];
  console.log("Deserialesed: ", deserialised);

  // 3. Map and return the values (TypeScript automatically infers string[])
  return deserialised.map((option) => option.value);
}

function stingToBoolean(str: FormDataEntryValue | null) {
  return str === "true";
}

export async function registerInstructorOne(
  prev: unknown,
  formdata: FormData,
): Promise<
  { success: boolean; message: string; route?: string } | Record<string, string>
> {
  try {
    const data = {
      occupation: formatSelectOptions(formdata.getAll("occupation")),
      specificSkills: formatSelectOptions(formdata.getAll("specificSkills")),
      yearsOfExpertise: (formdata.get("yearsOfExpertise") as string) || null,
      qualification: formatSelectOptions(formdata.getAll("qualification")),
    };
    console.log("Data: ", formdata.getAll("occupation"));

    stepOneSchema.parse(data);
    return {
      success: true,
      message: "Validation successful",
      route: "/instructor/step-two",
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const formatedZoderrors = formatZodErrors(error);
      return formatedZoderrors;
    } else {
      console.error(error);
      return { success: false, message: "Something went wrong" };
    }
  }
}

interface Data {
  termsAndConditions: boolean;
  equipment: boolean;
  sampleContentUrl: FormDataEntryValue | null;
}

export async function registerInstructorTwo(
  prev: unknown,
  formdata: FormData,
): Promise<
  | { success: boolean; message: string; route?: string; data?: Data }
  | Record<string, string>
> {
  try {
    const data = {
      termsAndConditions: stingToBoolean(formdata.get("termsAndConditions")),
      equipment: stingToBoolean(formdata.get("equipment")),
      sampleContentUrl: formdata.get("sampleContentUrl"),
    };

    stepTwoSchema.parse(data);
    return {
      success: true,
      message: "Validation successful",
      data: data,
      route: "/instructor/review",
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const formatedZoderrors = formatZodErrors(error);
      return formatedZoderrors;
    } else {
      console.error(error);
      return { success: false, message: "Something went wrong" };
    }
  }
}
