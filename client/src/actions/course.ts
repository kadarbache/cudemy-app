"use server";
import { apiRoutes } from "@/lib/apiRoutes";
import { cacheTags } from "@/lib/cacheTags";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { ICourse } from "@/util/interfaces";

// search courses by title, description or instructor name
// an empty query returns every course, which the search dialog shows as suggestions
export async function searchCoursesAction(query: string): Promise<ICourse[]> {
  try {
    const response = await fetch(apiRoutes.courses.searchCourses(query));

    if (!response.ok) return [];

    const { data } = await response.json();
    return data.courses ?? [];
  } catch (error) {
    console.error("Course search error:", error);
    return [];
  }
}

export async function enrollCourseAction(courseId: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(apiRoutes.courses.enrollCourse(courseId), {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      // only this course, enrolling is far too frequent to bust anything wider
      revalidateTag(cacheTags.course(courseId));
      return { status: "success", message: "Enrolled successfully" };
    } else {
      return {
        status: "error",
        message: data.message,
        statusCode: data.statusCode,
      };
    }
  } catch (error) {
    console.error("Enrollment error:", error);
    return {
      status: "error",
      message: "Failed to enroll",
    };
  }
}
