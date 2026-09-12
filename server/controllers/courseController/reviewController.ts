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
