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
import {
  getCart,
  addToCart,
  removeFromCart,
} from '../controllers/courseController/cartController.ts'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/courseController/wishlistController.ts'
import {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
  getInstructorReviews,
  replyToReview,
  deleteReply,
} from '../controllers/courseController/reviewController.ts'
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

// Get the courses in the current user's cart
// this sits above /:courseId on purpose, otherwise 'cart' is read as a course id
courseRouter.route('/cart').get(session, getCart)

// Add a course to / remove a course from the current user's cart
courseRouter
  .route('/cart/:courseId')
  .post(session, addToCart)
  .delete(session, removeFromCart)

// Get the courses in the current user's wishlist
// this sits above /:courseId on purpose, otherwise 'wishlist' is read as a course id
courseRouter.route('/wishlist').get(session, getWishlist)

// Add a course to / remove a course from the current user's wishlist
courseRouter
  .route('/wishlist/:courseId')
  .post(session, addToWishlist)
  .delete(session, removeFromWishlist)

// Every review across the courses the current user teaches, the queue behind
// the dashboard. this sits above /:courseId on purpose, same as cart and
// wishlist, so 'reviews' is never read as a course id
courseRouter.route('/reviews/received').get(session, getInstructorReviews)

// Get a specific course by its ID
courseRouter.route('/:courseId').get(optionalSession, getCourse)

// Get a specific course created by the instructor
courseRouter.route('/yourcourse/:courseId').get(session, getYourCourse)

// Check whether the current user is enrolled in a course
courseRouter
  .route('/:courseId/enrollment')
  .get(optionalSession, getCourseEnrollment)

// The reviews on a course. Reading is public, writing is one review per
// enrolled user, so post/patch/delete all act on the caller's own review
courseRouter
  .route('/:courseId/reviews')
  .get(getCourseReviews)
  .post(session, createReview)
  .patch(session, updateReview)
  .delete(session, deleteReview)

// The instructor's answer to one review. put, not post: a review holds at most
// one reply, so answering twice is an edit
courseRouter
  .route('/:courseId/reviews/:reviewId/reply')
  .put(session, replyToReview)
  .delete(session, deleteReply)

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
