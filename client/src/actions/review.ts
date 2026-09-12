"use server";
import { apiRoutes } from "@/lib/apiRoutes";
import { cacheTags } from "@/lib/cacheTags";
import { getCookies } from "@/lib/helpers";
import { revalidateTag } from "next/cache";
import { IRatingDistribution, IReview } from "@/util/interfaces";

export interface CourseReviews {
  reviews: IReview[];
  distribution: IRatingDistribution;
}

const emptyDistribution: IRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// the review list is the same for everyone, so it is fetched without cookies
// and cached by tag, exactly like the public course payload. who wrote what is
// decided on the client by matching userId against the session.
export async function getCourseReviewsAction(
  courseId: string,
): Promise<CourseReviews> {
  try {
    const response = await fetch(apiRoutes.reviews.forCourse(courseId), {
      next: { tags: [cacheTags.courseReviews(courseId)] },
    });

    if (!response.ok) return { reviews: [], distribution: emptyDistribution };

    const { data } = await response.json();
    return {
      reviews: data.reviews ?? [],
      distribution: data.distribution ?? emptyDistribution,
    };
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return { reviews: [], distribution: emptyDistribution };
  }
}

// the list changes, and so does the average, which lives in the course payload
// and on every catalogue card
function bustReviewCaches(courseId: string) {
  revalidateTag(cacheTags.courseReviews(courseId));
  revalidateTag(cacheTags.course(courseId));
  revalidateTag(cacheTags.coursesList);
}

async function writeReview(
  courseId: string,
  method: "POST" | "PATCH",
  rating: number,
  body: string,
) {
  try {
    const response = await fetch(apiRoutes.reviews.forCourse(courseId), {
      method,
      headers: {
        Cookie: await getCookies(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rating, body }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        status: "error",
        message: data.message,
        statusCode: data.statusCode,
      };
    }

    bustReviewCaches(courseId);
    return {
      status: "success",
      message: method === "POST" ? "Review posted" : "Review updated",
    };
  } catch (error) {
    console.error("Review write error:", error);
    return { status: "error", message: "Failed to save your review" };
  }
}

export async function createReviewAction(
  courseId: string,
  rating: number,
  body: string,
) {
  return writeReview(courseId, "POST", rating, body);
}

export async function updateReviewAction(
  courseId: string,
  rating: number,
  body: string,
) {
  return writeReview(courseId, "PATCH", rating, body);
}

export async function deleteReviewAction(courseId: string) {
  try {
    const response = await fetch(apiRoutes.reviews.forCourse(courseId), {
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

    bustReviewCaches(courseId);
    return { status: "success", message: "Review removed" };
  } catch (error) {
    console.error("Review delete error:", error);
    return { status: "error", message: "Failed to remove your review" };
  }
}
