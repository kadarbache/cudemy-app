"use server";

import { apiRoutes } from "@/lib/apiRoutes";
import { cacheTags } from "@/lib/cacheTags";
import { getCookies } from "@/lib/helpers";
import { revalidateTag } from "next/cache";
import z from "zod";
import { registerInstrucor } from "../instructor/zodTypes";
import { InstructorRegistration } from "@/util/interfaces";
const validatedUser = z.object({
  name: z.string().min(4).max(15),
  language: z.enum(["English", "Somali"]),
});

// update user profile
export const updateProfile = async (
  prev: unknown,
  formdata: FormData,
): Promise<
  | {
      status: string;
      message: string;
    }
  | Record<string, string>
> => {
  const updatedUser = {
    name: formdata.get("name") as string,
    language: formdata.get("language") as string,
  };

  try {
    const validated = validatedUser.safeParse(updatedUser);
    if (!validated.success) {
      return { status: "error", message: validated.error.issues[0].message };
    }

    const response = await fetch(apiRoutes.user.updateProfile, {
      method: "PATCH",
      body: JSON.stringify(validated.data),
      headers: {
        cookie: await getCookies(),
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.ok) {
      revalidateTag(cacheTags.userSession);
      // the name shows on every course page this user teaches
      revalidateTag(cacheTags.instructorProfiles);
      return { status: "success", message: responseData.message };
    } else {
      return { status: "error", message: responseData.message };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return { status: "error", message: "Something went wrong" };
  }
};

// the signed in instructor's own registration record. not cached, it is read
// once on a settings tab and has to be fresh the moment it is edited
export const getInstructorProfile =
  async (): Promise<InstructorRegistration | null> => {
    try {
      const response = await fetch(apiRoutes.instructor.getInstructorProfile, {
        headers: { cookie: await getCookies() },
        cache: "no-store",
      });
      if (!response.ok) return null;
      const responseData = await response.json();
      return responseData.data as InstructorRegistration;
    } catch (error) {
      console.error("Get instructor profile error:", error);
      return null;
    }
  };

// the multi select posts the whole option object as json, we only want the values
function selectedValues(json: FormDataEntryValue | null) {
  if (typeof json !== "string") return [];
  const options = JSON.parse(json) as { value: string }[];
  return options.map((option) => option.value);
}

// single step instructor registration, the tab version of the /instructor wizard
export const becomeInstructor = async (
  prev: unknown,
  formdata: FormData,
): Promise<{ status: string; message: string }> => {
  const instructor = {
    occupation: selectedValues(formdata.get("occupation")),
    specificSkills: selectedValues(formdata.get("specificSkills")),
    yearsOfExpertise: formdata.get("yearsOfExpertise") as string,
    qualification: selectedValues(formdata.get("qualification")),
    termsAndConditions: formdata.get("termsAndConditions") === "true",
    equipment: formdata.get("equipment") === "true",
    sampleContentUrl: formdata.get("sampleContentUrl") as string,
  };

  try {
    const validated = registerInstrucor.safeParse(instructor);
    if (!validated.success) {
      return { status: "error", message: validated.error.issues[0].message };
    }

    const response = await fetch(apiRoutes.instructor.registerInstructor, {
      method: "POST",
      body: JSON.stringify(validated.data),
      headers: {
        cookie: await getCookies(),
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      return { status: "error", message: responseData.message };
    }

    // registering pushes the instructor role onto the user, the cached session
    // has to go or the navigation and the dashboard stay locked
    revalidateTag(cacheTags.userSession);
    return { status: "success", message: "You are officially an instructor" };
  } catch (error) {
    console.error("Become instructor error:", error);
    return { status: "error", message: "Something went wrong" };
  }
};

// updating profile picture
export const uploadProfileImage = async (formData: FormData) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/user/updateprofilepicture",
      {
        method: "PATCH",
        body: formData,
        headers: {
          cookie: await getCookies(),
        },
      },
    );

    const data = await response.json();
    if (response.ok) {
      revalidateTag(cacheTags.userSession);
      revalidateTag(cacheTags.instructorProfiles);
      return {
        status: "success",
        message: "profile image updated successfully",
      };
    } else {
      return {
        status: "error",
        message: data.message || "An unknown error occurred.",
      };
    }
  } catch (error) {
    console.error("Upload profile image error:", error);
    return { status: "error", message: "something went wrong" };
  }
};
