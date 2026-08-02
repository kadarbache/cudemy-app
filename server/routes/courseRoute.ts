import express from 'express'
import type { Router } from 'express'
import { session, optionalSession } from '../middlewares/sessionMiddleWare.ts'
import {
  getAllCourses,
  deleteCourse,
  updateCourse,
  createNewCourse,
  getCourse,
  getCourseEnrollment,
  getYourCourses,
  getYourCourse,
  getEnrolledCourses,
  enrollCourse,
} from '../controllers/courseController/courseController.ts'
import {
  createNewModule,
  deleteModule,
  updateModule,
  getAllModules,
  reordermodules,
} from '../controllers/courseController/moduleController.ts'
import {
  createNewLecture,
  deleteLacture,
  updateLecture,
  getAllLectures,
  deleteAllLectures,
  reorderLectures,
} from '../controllers/courseController/lectureController.ts'
// import { askQuestion } from '../controllers/courseController/questionController.ts'
import upload from '../utils/multer.ts'
const courseRouter: Router = express.Router()

// ==========================================
// Course Routes
// ==========================================

// Get all available courses
courseRouter.route('/').get(getAllCourses)

// Get all courses created by the current instructor
courseRouter.route('/yourcourses').get(session, getYourCourses)

// Get all courses the current user is enrolled in
courseRouter.route('/enrolled').get(session, getEnrolledCourses)

// Get a specific course by its ID
courseRouter.route('/:courseId').get(optionalSession, getCourse)

// Get a specific course created by the instructor
courseRouter.route('/yourcourse/:courseId').get(session, getYourCourse)

// Check whether the current user is enrolled in a course
courseRouter
  .route('/:courseId/enrollment')
  .get(optionalSession, getCourseEnrollment)

// enroll in a course
courseRouter.route('/enroll/:courseId').post(session, enrollCourse)

// Create a new course (requires thumbnail upload)
courseRouter
  .route('/newcourse')
  .post(session, upload.single('thumbnail'), createNewCourse)

// Update an existing course (allows thumbnail update)
courseRouter
  .route('/updatecourse/:courseId')
  .patch(session, upload.single('thumbnail'), updateCourse)

// Delete a course by its ID
courseRouter.route('/deletecourse/:courseId').delete(session, deleteCourse)

// ==========================================
// Module Routes
// ==========================================

// Get all modules (useful for testing or admin)
courseRouter.route('/modules').get(session, getAllModules)

// Create a new module for a specific course
courseRouter.route('/newmodule/:courseId').post(session, createNewModule)

// Update an existing module
courseRouter.route('/updatemodule/:moduleId').patch(session, updateModule)

// Delete a module by its ID
courseRouter.route('/deleteModule/:moduleId').delete(session, deleteModule)

// Reorder modules
courseRouter.route('/reordermodules/:courseId').patch(session, reordermodules)

// ==========================================
// Lecture Routes
// ==========================================

// Get all lectures (useful for testing or admin)
courseRouter.route('/lectures').get(session, getAllLectures)

// Create a new lecture for a specific module (requires video upload)
courseRouter
  .route('/newlecture/:moduleId')
  .post(session, upload.single('lecture'), createNewLecture)

// Update an existing lecture (allows video update)
courseRouter
  .route('/updatelecture/:lectureId')
  .patch(session, upload.single('lecture'), updateLecture)

// Delete a specific lecture by its ID
courseRouter.route('/deletelacture/:lactureId').delete(session, deleteLacture)

// Delete all lectures (use with caution)
courseRouter.route('/deletelectures').delete(session, deleteAllLectures)

// Reorder lectures within a module
courseRouter.route('/reorderlectures/:moduleId').patch(session, reorderLectures)

// ==========================================
// Question Routes (Commented Out)
// ==========================================

// Ask a question related to a lecture
// courseRouter
//   .route('/lecture/:lectureId/question')
//   .post(session, upload.single('questionImage'), askQuestion)

export default courseRouter
