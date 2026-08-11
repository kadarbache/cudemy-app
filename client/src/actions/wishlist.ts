"use server";
import { apiRoutes } from "@/lib/apiRoutes";
import { getCookies } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { IWishlistItem } from "@/util/interfaces";

// the wishlist is per user, so it is never cached and never tagged, same
// reasoning as getEnrolledCourses / getCartAction. null means we could not
// read it, which is almost always "not signed in"
export async function getWishlistAction(): Promise<IWishlistItem[] | null> {
  const cookie = await getCookies();

  try {
    const response = await fetch(apiRoutes.wishlist.getWishlist, {
      headers: { Cookie: cookie },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const { data } = await response.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return null;
  }
}

export async function addToWishlistAction(courseId: string) {
  try {
    const response = await fetch(apiRoutes.wishlist.addToWishlist(courseId), {
      method: "POST",
      headers: {
        Cookie: await getCookies(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        status: "error",
        message: data.message,
        statusCode: data.statusCode,
      };
    }

    revalidatePath("/cart");
    revalidatePath("/account");
    return { status: "success", message: "Added to wishlist" };
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return { status: "error", message: "Failed to add to wishlist" };
  }
}

export async function removeFromWishlistAction(courseId: string) {
  try {
    const response = await fetch(
      apiRoutes.wishlist.removeFromWishlist(courseId),
      {
        method: "DELETE",
        headers: {
          Cookie: await getCookies(),
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return {
        status: "error",
        message: data.message,
        statusCode: data.statusCode,
      };
    }

    revalidatePath("/cart");
    revalidatePath("/account");
    return { status: "success", message: "Removed from wishlist" };
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return { status: "error", message: "Failed to remove from wishlist" };
  }
}
