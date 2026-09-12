# Compute review aggregates on read

A Course carries no `averageRating` or `reviewCount` field: both are derived with
a `groupBy` over its Reviews every time a course payload is built. The obvious
alternative — denormalising the two onto `Course` and updating them on every
review write — is faster to read but cannot be made safe here, because Prisma on
MongoDB only supports transactions on a replica set. A write that saved the
Review and then failed to update the counters would leave the average
permanently wrong, with nothing in the system able to detect the drift.

We took the slower read over the undetectable corruption. The cost is one extra
aggregation per catalogue request, largely absorbed by the hour-long cache on the
public course payloads (`PUBLIC_COURSE_REVALIDATE`). If that ever stops being
acceptable, adding the fields later is a contained change; repairing counters
that have silently drifted is not.

## Consequences

- Every new surface that shows a rating must pull it from a course payload built
  by `courseReviewStats`, rather than reading a field off `Course`.
- `getAllCourses` aggregates the whole page of courses in one query, not one per
  card. Any future per-course fetch loop would undo the reasoning above.
