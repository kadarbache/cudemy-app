import type { Request, Response, NextFunction } from 'express'

import AppError from '../../utils/error.ts'
import { videoUploader } from '@/utils/cloudinary.ts'
import prisma from '@/lib/prisma.ts'
import type { User } from '@/utils/types.ts'
import { deleteLectureVideo } from '@/utils/helpers.ts'

declare module 'express' {
  interface Request {
    user?: User
  }
}

// Get all Lectures : Test
export async function getAllLectures(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await prisma.lecture.findMany()
    return res.status(200).json({
      message: 'lectures fetched successfully',
      status: 'success',
      data: {
        response,
      },
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error: ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

//TODO creating a new lecture for a course
export async function createNewLecture(
  req: Request<
    { moduleId: string },
    {},
    { title: string; description: string }
  >,
  res: Response,
  next: NextFunction,
) {
  //1) Getting the moduleId from params
  const { moduleId } = req.params
  if (!moduleId) {
    return next(new AppError('Module ID is required', 400))
  }

  //2) Getting the fields from the body
  const { title, description } = req.body
  if (!title || !description) {
    return next(
      new AppError('Title and description are required for the lecture', 400),
    )
  }

  //3) Checking the user (instructor)
  const user = req.user
  if (!user?.roles.includes('instructor')) {
    return next(new AppError('User not found, please login', 404))
  }

  try {
    //4) Getting the video file from multer
    const lectureVideoFile = req.file
    if (!lectureVideoFile) {
      return next(new AppError('No lecture video file uploaded', 400))
    }

    //5) Uploading the video to Cloudinary
    const videoUploadResult = await videoUploader(lectureVideoFile.buffer)
    if (
      !videoUploadResult ||
      !videoUploadResult.public_id ||
      !videoUploadResult.secure_url
    ) {
      return next(new AppError('Failed to upload video to Cloudinary', 500))
    }

    //6) Finding the module to get the current number of lectures for order
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { lectures: true },
    })
    if (!module) {
      return next(new AppError('Module not found', 404))
    }

    // Determine the order for the new lecture
    const newOrder = module.lectures.length + 1

    //7) Creating the new lecture
    const newLecture = await prisma.lecture.create({
      data: {
        title,
        description,
        secureUrl: videoUploadResult.secure_url, // Cloudinary secure URL

        moduleId: moduleId,
        instructorId: user.id,
        duration: videoUploadResult['duration'] || 0,
        publicId: videoUploadResult.public_id, // Cloudinary public ID
        order: newOrder,
      },
    })

    //8) Adding the new lecture to the module's lectures array
    await prisma.module.update({
      where: { id: moduleId },
      data: {
        lectures: {
          connect: { id: newLecture.id },
        },
      },
    })

    //9) Updating the course's numberOfLectures and totalOfHours
    await prisma.course.update({
      where: { id: module.courseId },
      data: {
        numberOfLectures: { increment: 1 },
        totalOfHours: { increment: newLecture.duration },
      },
    })

    return res.status(200).json({
      status: 'success',
      data: {
        lecture: newLecture,
        // the caller needs it to revalidate the course page, a lecture only
        // carries its moduleId
        courseId: module.courseId,
      },
      message: 'Lecture created and added to module successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while creating lecture : ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}

// update a lecture
export async function updateLecture(
  req: Request<{ lectureId: string }>,
  res: Response,
  next: NextFunction,
) {
  //1 getting the params
  const { lectureId } = req.params
  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400))
  }

  try {
    //2 find the lecture
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    })
    if (!lecture) {
      return next(new AppError('Lecture not found', 404))
    }

    //3 find the module and course to verify instructor
    const module = await prisma.module.findUnique({
      where: { id: lecture.moduleId },
      include: { course: true },
    })
    if (!module) {
      return next(new AppError('Associated module not found', 404))
    }
    const course = module.course
    if (!course) {
      return next(new AppError('Associated course not found', 404))
    }

    //4 check if the user is the instructor of the course
    if (course.instructorId.toString() !== req?.user?.id.toString()) {
      return next(
        new AppError('You are not authorized to update this lecture', 403),
      )
    }

    //5 get the fields to update from the body
    const { title, description, isPreview } = req.body
    const updates: {
      title?: string
      description?: string
      isPreview?: boolean
      secureUrl?: string
      publicId?: string
      duration?: number
    } = {}
    if (title) updates.title = title
    if (description) updates.description = description
    if (isPreview !== undefined) updates.isPreview = isPreview

    //6 handle video update if a new one is provided
    if (req.file) {
      const oldDuration = lecture.duration || 0

      // Delete old video from Cloudinary
      if (lecture.publicId) {
        await deleteLectureVideo({ publicId: lecture.publicId })
      }

      // Upload new video
      const videoUploadResult = await videoUploader(req.file.buffer)
      if (
        !videoUploadResult ||
        !videoUploadResult.public_id ||
        !videoUploadResult.secure_url
      ) {
        return next(new AppError('Failed to upload new video', 500))
      }

      // Update lecture fields
      updates.secureUrl = videoUploadResult.secure_url
      updates.publicId = videoUploadResult.public_id
      updates.duration = videoUploadResult['duration'] || 0

      // Update course total duration

      if (updates.duration !== 0) {
        const durationDifference = (updates.duration || 0) - oldDuration
        await prisma.course.update({
          where: { id: course.id },
          data: {
            totalOfHours: { increment: durationDifference },
          },
        })
      }
    }

    //7 update the lecture
    const updatedLecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: updates,
    })

    return res.status(200).json({
      status: 'success',
      data: { lecture: updatedLecture, courseId: course.id },
      message: 'Lecture updated successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `Internal server error while updating lecture: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}

// delete all lectures | test
export async function deleteAllLectures(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await prisma.lecture.deleteMany()
    return res.status(200).json({
      message: 'lectures deleted successfully',
      status: 'success',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error: ${error instanceof Error ? error.message : 'unknown error'}`,
        500,
      ),
    )
  }
}

// Delete a single lecture
export async function deleteLacture(
  req: Request<{ lactureId: string }>,
  res: Response,
  next: NextFunction,
) {
  const { lactureId } = req.params
  if (!lactureId) {
    return next(new AppError('Lecture ID is required', 400))
  }

  try {
    const user = req.user
    if (!user) {
      return next(new AppError('User not found, please login', 404))
    }

    const lecture = await prisma.lecture.findUnique({
      where: { id: lactureId },
      include: { instructor: true },
    })
    if (!lecture) {
      return next(new AppError('Lecture not found', 404))
    }

    // Check if the user is authorized to delete this lecture
    if (
      !lecture.instructor ||
      lecture.instructor.id.toString() !== user.id.toString()
    ) {
      return next(
        new AppError('You are not authorized to delete this lecture', 403),
      )
    }

    // 1. Delete the video from Cloudinary
    await deleteLectureVideo({ publicId: lecture.publicId })

    // 2. Delete the lecture document from the database
    await prisma.lecture.delete({
      where: { id: lactureId },
    })

    // 3. Remove lecture reference from the parent module
    const parentModule = await prisma.module.update({
      where: { id: lecture.moduleId },
      data: { lectures: { disconnect: { id: lecture.id } } },
    })

    // 4. Update course's numberOfLectures and totalOfHours
    if (parentModule && parentModule.courseId) {
      await prisma.course.update({
        where: { id: parentModule.courseId },
        data: {
          numberOfLectures: { decrement: 1 },
          totalOfHours: { decrement: lecture.duration || 0 },
        },
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Lecture deleted successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `internal server error while deleting lecture : ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}

/*
Performance: Since this only happens for the lessons inside one module (usually a small number like 5–20), the database operation is extremely fast and won't cause any lag.
*/

// Reorder lectures within a module
export async function reorderLectures(
  req: Request<{ moduleId: string }, {}, { lectureIds: string[] }>,
  res: Response,
  next: NextFunction,
) {
  const { moduleId } = req.params
  const { lectureIds } = req.body

  if (!moduleId) {
    return next(new AppError('Module ID is required', 400))
  }

  if (!lectureIds || !Array.isArray(lectureIds) || lectureIds.length === 0) {
    return next(new AppError('Lecture IDs array is required', 400))
  }

  const user = req.user
  if (!user?.roles.includes('instructor')) {
    return next(new AppError('User not found, please login', 404))
  }

  try {
    // Find the module and verify the instructor
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    })

    if (!module) {
      return next(new AppError('Module not found', 404))
    }

    if (module.course.instructorId.toString() !== user.id.toString()) {
      return next(
        new AppError(
          'You are not authorized to reorder lectures in this module',
          403,
        ),
      )
    }

    // Update each lecture's order using a transaction
    await prisma.$transaction(
      lectureIds.map((lectureId, index) =>
        prisma.lecture.update({
          where: { id: lectureId },
          data: { order: index + 1 },
        }),
      ),
    )

    return res.status(200).json({
      status: 'success',
      data: { courseId: module.courseId },
      message: 'Lectures reordered successfully',
    })
  } catch (error) {
    return next(
      new AppError(
        `Internal server error while reordering lectures: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
        500,
      ),
    )
  }
}
