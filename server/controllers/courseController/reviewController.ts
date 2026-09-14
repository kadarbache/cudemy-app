import type { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/error.ts'
import prisma from '@/lib/prisma.ts'
import type { User } from '@/utils/types.ts'

declare module 'express' {
  interface Request {
    user?: User
  }
}

const MAX_BODY_LENGTH = 1000
const MAX_REPLY_LENGTH = 1000

// the reviewer's public identity, the only part of a User a review ever exposes
const reviewAuthor = {
  select: { id: true, name: true, image: true },
} as const

// a rating is a whole number of stars, 4.5 is not something a person can pick
function parseRating(value: unknown): number | null {
  const rating = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null
  return rating
}

// an empty textarea is no text at all, not an empty review. undefined means the
// value was unusable, null means there legitimately is no body
function parseBody(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') return undefined
  const body = value.trim()
  if (body.length === 0) return null
  if (body.length > MAX_BODY_LENGTH) return undefined
  return body
}

// a reply is text or it is not a reply at all: an empty one means the instructor
// wants it gone, which is what DELETE is for
function parseReply(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const reply = value.trim()
  if (reply.length === 0 || reply.length > MAX_REPLY_LENGTH) return null
  return reply
}

// the course the review sits on, and whether this user is the one who teaches
// it. ownership lives on the Course and does not change under us, so reading it
// before the write is safe in a way that reading a review's owner would not be
async function checkOwnership(user: User, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, instructorId: true },
  })
  if (!course) return new AppError('course not found', 404)

  if (course.instructorId !== user.id) {
    return new AppError('only the instructor of this course can reply', 403)
  }

  return null
}

// everything that has to be true before a review can exist: a real course the
// user is enrolled in and does not teach
async function checkEligibility(user: User, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, instructorId: true },
  })
  if (!course) return new AppError('course not found', 404)

  if (course.instructorId === user.id) {
    return new AppError('you cannot review your own course', 403)
  }

  const enrollment = await prisma.enrolledCourse.findFirst({
    where: { userId: user.id, courseId: course.id },
  })
  if (!enrollment) {
    return new AppError('you must be enrolled to review this course', 403)
  }

  return null
}

// the reviews on a course, newest first, plus how many sit on each star.
// public, so every visitor gets the same payload and it can be cached
export async function getCourseReviews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('course id is required', 400))
  }

  try {
    const [reviews, grouped] = await Promise.all([
      prisma.review.findMany({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
        include: { user: reviewAuthor },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { courseId },
        _count: { rating: true },
      }),
    ])

    // every star gets a key, so the client never has to fill in the gaps
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const row of grouped) {
      distribution[row.rating] = row._count.rating
    }

    return res.status(200).json({
      status: 'success',
      data: { reviews, distribution },
      message: 'reviews fetched successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching the reviews ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// write the current user's review of a course
export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('course id is required', 400))
  }

  //2 validating what was sent
  const rating = parseRating(req.body?.rating)
  if (rating === null) {
    return next(new AppError('rating must be a whole number from 1 to 5', 400))
  }
  const body = parseBody(req.body?.body)
  if (body === undefined) {
    return next(
      new AppError(
        `a review can be at most ${MAX_BODY_LENGTH} characters`,
        400,
      ),
    )
  }

  try {
    //3 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //4 the course has to exist, and be one the user took and does not teach
    const ineligible = await checkEligibility(user, courseId)
    if (ineligible) return next(ineligible)

    //5 the course holds one review per person, so a second one is an edit
    const existing = await prisma.review.findFirst({
      where: { userId: user.id, courseId },
    })
    if (existing) {
      return next(new AppError('you have already reviewed this course', 400))
    }

    //6 write it
    const review = await prisma.review.create({
      data: { userId: user.id, courseId, rating, body },
      include: { user: reviewAuthor },
    })

    return res.status(201).json({
      status: 'success',
      data: { review },
      message: 'review posted successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while posting the review ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// change the current user's review of a course
export async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('course id is required', 400))
  }

  //2 validating what was sent
  const rating = parseRating(req.body?.rating)
  if (rating === null) {
    return next(new AppError('rating must be a whole number from 1 to 5', 400))
  }
  const body = parseBody(req.body?.body)
  if (body === undefined) {
    return next(
      new AppError(
        `a review can be at most ${MAX_BODY_LENGTH} characters`,
        400,
      ),
    )
  }

  try {
    //3 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //4 update by the pair, so one user can never edit another user's review
    const { count } = await prisma.review.updateMany({
      where: { userId: user.id, courseId },
      data: { rating, body },
    })
    if (count === 0) {
      return next(new AppError('you have not reviewed this course', 404))
    }

    const review = await prisma.review.findFirst({
      where: { userId: user.id, courseId },
      include: { user: reviewAuthor },
    })

    return res.status(200).json({
      status: 'success',
      data: { review },
      message: 'review updated successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while updating the review ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// take back the current user's review of a course
export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('course id is required', 400))
  }

  try {
    //2 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //3 delete by the pair, so one user can never delete another user's review
    const { count } = await prisma.review.deleteMany({
      where: { userId: user.id, courseId },
    })
    if (count === 0) {
      return next(new AppError('you have not reviewed this course', 404))
    }

    return res.status(200).json({
      status: 'success',
      data: { courseId },
      message: 'review removed successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while removing the review ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// every review sitting on a course the current user teaches, newest first.
// this is the queue behind the dashboard, so it carries the course each review
// landed on. private, unlike getCourseReviews
export async function getInstructorReviews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //1 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //2 one query over every course they teach, not one query per course
    const reviews = await prisma.review.findMany({
      where: { course: { instructorId: user.id } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: reviewAuthor,
        course: { select: { id: true, title: true, secureUrl: true } },
      },
    })

    return res.status(200).json({
      status: 'success',
      data: { reviews },
      message: 'reviews fetched successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching your reviews ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// answer one review. a review holds at most one reply, so writing twice is an
// edit, which is why this is a PUT and takes no separate create path
export async function replyToReview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId, reviewId } = req.params
  if (!courseId || !reviewId) {
    return next(new AppError('course id and review id are required', 400))
  }

  //2 validating what was sent
  const reply = parseReply(req.body?.reply)
  if (reply === null) {
    return next(
      new AppError(
        `a reply must be text of at most ${MAX_REPLY_LENGTH} characters`,
        400,
      ),
    )
  }

  try {
    //3 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //4 only the instructor of the course answers the reviews on it
    const notTheirs = await checkOwnership(user, courseId)
    if (notTheirs) return next(notTheirs)

    //5 scope the write by the pair, so a review id from another course can
    //  never be reached through this one
    const { count } = await prisma.review.updateMany({
      where: { id: reviewId, courseId },
      data: { reply, repliedAt: new Date() },
    })
    if (count === 0) {
      return next(new AppError('review not found', 404))
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { user: reviewAuthor },
    })

    return res.status(200).json({
      status: 'success',
      data: { review },
      message: 'reply posted successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while posting the reply ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// take back the reply, leaving the review itself untouched
export async function deleteReply(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId, reviewId } = req.params
  if (!courseId || !reviewId) {
    return next(new AppError('course id and review id are required', 400))
  }

  try {
    //2 check if the user exist
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    //3 only the instructor of the course answers the reviews on it
    const notTheirs = await checkOwnership(user, courseId)
    if (notTheirs) return next(notTheirs)

    //4 clearing both halves together, a reply time with no reply is nonsense
    const { count } = await prisma.review.updateMany({
      where: { id: reviewId, courseId },
      data: { reply: null, repliedAt: null },
    })
    if (count === 0) {
      return next(new AppError('review not found', 404))
    }

    return res.status(200).json({
      status: 'success',
      data: { reviewId },
      message: 'reply removed successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while removing the reply ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}
