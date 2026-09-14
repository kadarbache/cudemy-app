import type { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/error.ts'
import prisma from '@/lib/prisma.ts'
import type { User } from '@/utils/types.ts'

declare module 'express' {
  interface Request {
    user?: User
  }
}

// get the courses sitting in the current user's wishlist
export async function getWishlist(
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

    //2 get the wishlist items with the course they point at
    // same as the cart: enrolling deletes these rows, and this keeps one that
    // outlived a failed delete from showing a course the user already owns
    const enrolled = await prisma.enrolledCourse.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    })
    const enrolledIds = enrolled.map((row) => row.courseId)

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id, courseId: { notIn: enrolledIds } },
      orderBy: { addedAt: 'desc' },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    })

    return res.status(200).json({
      status: 'success',
      data: {
        items,
      },
      message: 'wishlist fetched successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching the wishlist ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// add a course to the current user's wishlist
export async function addToWishlist(
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

    //3 get the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })
    if (!course) {
      return next(new AppError('course not found', 404))
    }

    //4 a course you already own has no business being in the wishlist
    const isEnrolled = await prisma.enrolledCourse.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    })
    if (isEnrolled) {
      return next(new AppError('you are already enrolled in this course', 400))
    }

    //5 the wishlist holds a course once, so adding it twice is a no-op worth saying
    const alreadyInWishlist = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    })
    if (alreadyInWishlist) {
      return next(new AppError('this course is already in your wishlist', 400))
    }

    //6 add it
    const item = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    })

    return res.status(200).json({
      status: 'success',
      data: { item },
      message: 'course added to wishlist successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while adding to the wishlist ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// remove a course from the current user's wishlist
export async function removeFromWishlist(
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

    //3 delete by the pair, so one user can never remove another user's item
    const { count } = await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        courseId,
      },
    })
    if (count === 0) {
      return next(new AppError('this course is not in your wishlist', 404))
    }

    return res.status(200).json({
      status: 'success',
      data: { courseId },
      message: 'course removed from wishlist successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while removing from the wishlist ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}
