// Every next.tags value and every revalidateTag argument in the app comes from
// here, so a read and a write can never drift apart on a typo.
export const cacheTags = {
  // the logged in user's own session, cached per cookie on purpose
  userSession: "userSession",
  // the course catalogue behind GET /course
  coursesList: "courses",
  // one public course payload behind GET /course/:courseId
  course: (courseId: string) => `course:${courseId}`,
  // the instructor name, image, bio and stats that sit inside every course
  // payload. a fetch can only be tagged with what is known before the response
  // arrives, and the instructor id only arrives in the body, so this one coarse
  // tag stands in for "some instructor's public data changed". only the rare
  // mutations bust it: profile edits, avatar uploads, creating and deleting a
  // course. enrolling deliberately does not, it is far too frequent.
  instructorProfiles: "instructor-profiles",
} as const;

// Backstop only. Every mutation busts a tag above, so this just bounds the one
// drift we accept (instructorStats.totalStudents on an instructor's other
// course pages after someone enrolls) and covers any future mutation that
// forgets its tag. Never false or Infinity, that would make a missed tag
// permanent.
export const PUBLIC_COURSE_REVALIDATE = 3600;
