# Context

The language this codebase uses for its domain. Terms only — no implementation
details, no design decisions. Design lives in `design.md`, decisions in
`docs/adr/`.

## Course

A unit of instruction sold on the platform. Owned by exactly one **Instructor**,
made of ordered **Modules**, each made of ordered **Lectures**.

## Instructor

A **User** who owns Courses. Being an instructor is a role on a User, plus a
separate profile record holding what they filled in when they applied.

## Student

A **User** looking at or taking Courses. Every User is a student; the role is the
default. Not a separate record.

## Enrollment

A User having access to a Course's Lectures. Free and instant today — enrolling
is one click and involves no payment. So "enrolled" means "has access", it does
not mean "paid" and it does not mean "watched".

## Review

One User's verdict on one Course: a rating of 1 to 5 whole stars, plus optional
text. A User may hold at most one Review per Course, and may change or withdraw
it. Only an enrolled User may write one, and never on a Course they teach.

**Not to be confused with** the instructor application review — the step where a
User submits their instructor application and it is looked over. That older sense
survives in the `/instructor/review` route and the `guidelinesReviewed` field.
When this codebase says `Review` unqualified, it means the verdict on a Course.

## Response

The instructor's answer to one Review, written from the dashboard and shown
publicly underneath the Review it answers. A Review holds at most one, only the
instructor of that Course may write it, and writing a second one replaces the
first — which is why the endpoint is a `PUT`.

A Response carries no Rating and is never a Review in its own right. It cannot
be: the instructor is barred from reviewing their own Course, and any extra
Review row would land in the average (see
[ADR 0001](docs/adr/0001-compute-review-aggregates-on-read.md)). It lives as two
fields on the Review, `reply` and `repliedAt`, so removing the Review removes
the answer with it.

## Rating

The star component of a Review, 1 to 5, always a whole number — a person picks
four stars, never four and a half.

An **average rating** is a Course's mean Rating across its Reviews. It is a
derived value, never stored (see [ADR 0001](docs/adr/0001-compute-review-aggregates-on-read.md)).
A Course nobody has reviewed has *no* average, which is not the same as an
average of zero.

## Wishlist / Cart

Two lists of Courses a User has set aside. A Course sits in either list once or
not at all — there is no quantity. A Course a User is already enrolled in belongs
in neither.
