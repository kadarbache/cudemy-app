import { apiRoutes } from "@/lib/apiRoutes";
import { PUBLIC_COURSE_REVALIDATE, cacheTags } from "@/lib/cacheTags";
import { getCookies } from "@/lib/helpers";
import { ICourse } from "@/util/interfaces";

/*
Never put a Cookie header on a fetch that carries next.tags or next.revalidate.
Next hashes the request options into the cache key, so the cookie gives every
session its own private copy of the page: all of the staleness of caching and
none of the sharing. The public payload below is fetched without cookies and
the per user flag is fetched separately with no cache at all.
*/

// the public course payload, shared by every visitor and invalidated by tag
export async function getPublicCourse(
  courseId: string,
): Promise<ICourse | null> {
  const response = await fetch(apiRoutes.courses.getCourseById(courseId), {
    next: {
      revalidate: PUBLIC_COURSE_REVALIDATE,
      tags: [cacheTags.course(courseId), cacheTags.instructorProfiles],
    },
  });

  if (!response.ok) return null;

  const { data } = await response.json();
  return data as ICourse;
}

// per user, so never cached and never tagged
export async function getCourseEnrollment(courseId: string): Promise<boolean> {
  const response = await fetch(apiRoutes.courses.getCourseEnrollment(courseId), {
    headers: { Cookie: await getCookies() },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) return false;

  const { data } = await response.json();
  return Boolean(data.isEnrolled);
}
