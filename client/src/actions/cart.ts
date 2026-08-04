"use server";
import { apiRoutes } from "@/lib/apiRoutes";
import { getCookies } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { ICartItem } from "@/util/interfaces";

// the cart is per user, so it is never cached and never tagged, same reasoning
// as getEnrolledCourses. null means we could not read it, which is almost
// always "not signed in", and is what lets the page offer a sign in link
// instead of claiming the cart is empty
export async function getCartAction(): Promise<ICartItem[] | null> {
  // read outside the try. this one runs during a page render, and cookies()
  // signals "this route is dynamic" by throwing, so catching it here would
  // swallow that and let the route prerender as a permanently empty cart
  const cookie = await getCookies();

  try {
    const response = await fetch(apiRoutes.cart.getCart, {
      headers: { Cookie: cookie },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const { data } = await response.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Cart fetch error:", error);
    return null;
  }
}

export async function addToCartAction(courseId: string) {
  try {
    const response = await fetch(apiRoutes.cart.addToCart(courseId), {
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

    // the cart page reads with no-store, this just drops the client router copy
    revalidatePath("/cart");
    return { status: "success", message: "Added to cart" };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { status: "error", message: "Failed to add to cart" };
  }
}

export async function removeFromCartAction(courseId: string) {
  try {
    const response = await fetch(apiRoutes.cart.removeFromCart(courseId), {
      method: "DELETE",
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
    return { status: "success", message: "Removed from cart" };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { status: "error", message: "Failed to remove from cart" };
  }
}
