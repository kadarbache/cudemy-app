import type { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/error.ts'
import { uploadImage, deleteImage } from '../../utils/cloudinary.ts'
import prisma from '@/lib/prisma.ts'
import type { User } from '@/utils/types.ts'
import { deleteMultipleLectureVideos } from '@/utils/helpers.ts'
import { courseReviewStats, noReviews } from '@/utils/reviewStats.ts'

declare module 'express' {
  interface Request {
    user?: User
  }
}

// get all courses, optionally narrowed by a ?search= keyword
export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const search =
    typeof req.query['search'] === 'string' ? req.query['search'].trim() : ''

  try {
    const courses = await prisma.course.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              {
                instructor: {
                  is: { name: { contains: search, mode: 'insensitive' } },
                },
              },
            ],
          }
        : {},
      include: {
        instructor: true,
      },
    })

    // the cards show a rating, so the whole page of them is aggregated at once
    const stats = await courseReviewStats(courses.map((course) => course.id))

    return res.status(200).json({
      status: 'success',
      data: {
        courses: courses.map((course) => ({
          ...course,
          ...(stats.get(course.id) ?? noReviews),
        })),
      },
      message: 'courses fetched successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching courses ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

export async function getYourCourses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1) getting the user
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }
    // 2) getting the courses of the instructor
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id },
      include: {
        instructor: true,
      },
    })
    return res.status(200).json({
      status: 'success',
      data: {
        courses,
      },
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching your courses ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// get the courses the current user is enrolled in
export async function getEnrolledCourses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // 1) getting the user
    const user = req.user
    if (!user) {
      return next(new AppError('user not found', 404))
    }

    // 2) getting the enrollments of the user
    const enrollments = await prisma.enrolledCourse.findMany({
      where: { userId: user.id },
      orderBy: { entrolledAt: 'desc' },
      include: {
        course: {
          include: {
            instructor: true,
            modules: {
              include: {
                lectures: true,
              },
            },
          },
        },
      },
    })

    // 3) flattening the enrollments into courses
    const courses = enrollments.map((enrollment) => ({
      ...enrollment.course,
      isEnrolled: true,
      entrolledAt: enrollment.entrolledAt,
    }))

    return res.status(200).json({
      status: 'success',
      data: {
        courses,
      },
      message: 'enrolled courses fetched successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching enrolled courses ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

export async function getYourCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 check if the user exist
  const user = req.user
  if (!user) {
    return next(new AppError('user not found', 404))
  }
  try {
    //2 get the course id from params
    const { courseId } = req.params
    if (!courseId) {
      return next(new AppError('course id is required', 400))
    }

    // 3 get the course
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: user.id },
      include: {
        modules: {
          include: {
            lectures: true,
          },
        },
      },
    })

    if (!course) {
      return next(new AppError('course not found', 404))
    }
    return res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while fetching your course ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// get a course
export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // getting the course Id
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('Course ID is required', 400))
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lectures: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            // the instructor profile filled in when the user registered as one
            instructor: {
              select: {
                expertise: true,
                yearsOfExperience: true,
                instructorBio: true,
              },
            },
          },
        },
        // how many students are enrolled in this course
        _count: { select: { students: true } },
      },
    })
    if (!course) {
      return next(new AppError('no course found with this id', 404))
    }

    // stats shown on the instructor section of the course page
    const [totalCourses, totalStudents, reviewStats] = await Promise.all([
      prisma.course.count({
        where: { instructorId: course.instructorId },
      }),
      prisma.enrolledCourse.count({
        where: { course: { is: { instructorId: course.instructorId } } },
      }),
      courseReviewStats([course.id]),
    ])

    let isEnrolled = false
    if (req.user) {
      const enrollment = await prisma.enrolledCourse.findFirst({
        where: {
          userId: req.user.id,
          courseId: course.id,
        },
      })
      if (enrollment) {
        isEnrolled = true
      }
    }

    res.status(200).json({
      message: 'here is your course',
      data: {
        ...course,
        ...(reviewStats.get(course.id) ?? noReviews),
        isEnrolled,
        instructorStats: { totalCourses, totalStudents },
      },
    })
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return next(error)
    }
    return next(
      new AppError(
        `internal server error while getting a course ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}

// whether the current user is enrolled in a course. this lives apart from
// getCourse so the client can fetch the public course payload without sending
// cookies, which lets next cache one copy of it for every visitor
export async function getCourseEnrollment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('Course ID is required', 400))
  }

  try {
    // a visitor with no session is simply not enrolled, it is not an error
    if (!req.user) {
      return res.status(200).json({
        status: 'success',
        data: { isEnrolled: false },
      })
    }

    const enrollment = await prisma.enrolledCourse.findFirst({
      where: {
        userId: req.user.id,
        courseId,
      },
    })

    return res.status(200).json({
      status: 'success',
      data: { isEnrolled: enrollment !== null },
    })
  } catch (error: unknown) {
    return next(
      new AppError(
        `internal server error while checking enrollment ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}

interface CreateCourse {
  title: string
  description: string
  level: string[]
  category: string[]
}

// create a new course
export async function createNewCourse(
  req: Request<{}, {}, CreateCourse>,
  res: Response,
  next: NextFunction,
) {
  //1) getting the fields from the body
  const { title, description, level, category } = req.body
  if (!title || !description || !level || !category) {
    return next(new AppError('all fields are required', 400))
  }
  //2) getting the Image from multer
  const thumbnail = req.file
  if (!thumbnail) {
    return next(new AppError('no file uploaded', 400))
  }

  try {
    //3) getting the user
    const user = req.user
    if (!user?.roles.includes('instructor')) {
      return next(new AppError('you are not an instructor', 403))
    }

    if (!user) return next(new AppError('user not found', 404))

    //4) uploading the thumblain to cloudinary
    const uploadResult = await uploadImage(thumbnail.buffer)

    if (!uploadResult) {
      return next(new AppError('Failed to upload image to Cloudinary', 500))
    }

    const { public_id, secure_url } = uploadResult
    if (!public_id || !secure_url) {
      return next(new AppError('Failed to upload image to Cloudinary', 500))
    }

    //5) saving the data in the db
    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: Array.isArray(level) ? level : [level],
        category: Array.isArray(category) ? category : [category],
        publicId: public_id,
        secureUrl: secure_url,
        instructorId: user.id,
      },
    })

    return res.status(200).json({
      status: 'sucess',
      data: {
        course,
      },
      message: 'course created successfully',
    })
  } catch (error: unknown) {
    return next(
      new AppError(
        `internal server error while creating course : ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// delete a course
export async function deleteCourse(
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
      include: {
        instructor: true,
      },
    })
    if (!course) {
      return next(new AppError('course not found', 404))
    }

    //4 checking if the course has the id of the current instructor
    const isCorrect = course.instructor.id.toString() === user.id.toString()
    if (!isCorrect) {
      return next(
        new AppError('you are not authorized to delete this course', 403),
      )
    }

    //5 delete the course
    const deletedCourse = await prisma.course.delete({
      where: { id: course.id },
      include: { modules: { include: { lectures: true } } },
    })

    //4 delete the course thumblain
    await deleteImage(deletedCourse.publicId)

    // 5 delete all the lesson which is related to the course
    const deletedLectures = deletedCourse.modules.flatMap((module) =>
      module.lectures.map((lecture) => lecture.publicId),
    )

    await deleteMultipleLectureVideos({ publicIds: deletedLectures })

    return res.status(200).json({
      status: 'success',
      data: {
        course,
      },
      message: 'course deleted successfully',
    })
  } catch (error) {
    console.error('Error in deleteCourse controller:', error)
    if (error instanceof AppError) {
      return next(
        new AppError(
          `internal server error while deleting course : ${error instanceof Error ? error.message : 'unknown error'}`,
          500,
        ),
      )
    }
  }
}

// update a course
export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { courseId } = req.params
  if (!courseId) {
    return next(new AppError('Course ID is required', 400))
  }

  try {
    //2 find the course
    // const course = await Course.findById(courseId)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    })
    if (!course) {
      return next(new AppError('Course not found', 404))
    }

    //3 check if the user is the instructor of the course
    if (course.instructor.id.toString() !== req?.user?.id.toString()) {
      return next(
        new AppError('You are not authorized to update this course', 403),
      )
    }

    //4 get the fields to update from the body
    const { title, description, level, category, price, discount } = req.body
    if (
      !title ||
      !description ||
      !level ||
      !category ||
      price === undefined ||
      discount === undefined
    ) {
      return next(
        new AppError(
          'all fields are required: title, description, level, category, price, discount',
          400,
        ),
      )
    }

    const updates: {
      title?: string
      description?: string
      level?: string[]
      category?: string[]
      thumbnail?: { public_id: string; secure_url: string }
      price?: number
      discount?: number
    } = {}

    if (title) updates.title = title
    if (description) updates.description = description
    if (level) updates.level = Array.isArray(level) ? level : [level]
    if (category)
      updates.category = Array.isArray(category) ? category : [category]
    // Convert string to number for Prisma (FormData sends strings)
    if (price !== undefined) updates.price = Number(price)
    if (discount !== undefined) updates.discount = Number(discount)

    //5 handle thumbnail update if a new one is provided
    if (req.file) {
      // Delete old thumbnail
      if (course.publicId) {
        await deleteImage(course.publicId)
      }
      // Upload new thumbnail
      const CloudinaryUploadResult = await uploadImage(req.file.buffer)
      if (
        !CloudinaryUploadResult?.public_id ||
        !CloudinaryUploadResult?.secure_url
      ) {
        return next(new AppError('Failed to upload new thumbnail', 500))
      }
      updates.thumbnail = {
        public_id: CloudinaryUploadResult.public_id,
        secure_url: CloudinaryUploadResult.secure_url,
      }
    }

    //6 update the course
    const updatedCourse = await prisma.course.update({
      where: {
        id: course.id,
      },
      data: updates,
    })

    return res.status(200).json({
      status: 'success',
      data: { course: updatedCourse },
      message: 'Course updated successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while updating course : ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// enroll course
export async function enrollCourse(
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

    // 4 checking if the user is already enrolled in the course
    const isEnrolled = await prisma.enrolledCourse.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    })
    if (isEnrolled) {
      return next(new AppError('you are already enrolled in this course', 400))
    }

    // 5 enroll the course
    const enrolledCourse = await prisma.enrolledCourse.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    })

    // 6 a course you now own belongs in neither list, so enrolling takes it out
    //   of both. these cannot run in the same transaction as the create (mongo
    //   here is not a replica set), so the reads filter enrolled courses out as
    //   well and a row left behind by a failure here is hidden rather than shown
    await Promise.all([
      prisma.cartItem.deleteMany({
        where: { userId: user.id, courseId: course.id },
      }),
      prisma.wishlistItem.deleteMany({
        where: { userId: user.id, courseId: course.id },
      }),
    ])

    return res.status(200).json({
      status: 'success',
      data: { course: enrolledCourse },
      message: 'course enrolled successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while enrolling course : ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}
