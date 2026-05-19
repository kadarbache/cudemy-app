"use server";

import { apiRoutes } from "@/lib/apiRoutes";
import { getCookies } from "@/lib/helpers";
import { revalidateTag } from "next/cache";
import z from "zod";
const validatedUser = z.object({
  name: z.string().min(4).max(15),
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
      revalidateTag("userSession");
      return { status: "success", message: responseData.message };
    } else {
      return { status: "error", message: responseData.message };
    }
  } catch (error) {
    console.error("Update profile error:", error);
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

    revalidateTag("userSession");
    const data = await response.json();
    if (response.ok) {
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
