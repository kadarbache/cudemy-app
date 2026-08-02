import {
  getInstructorProfile,
  registerInstructor,
} from '@/controllers/instructorCountroller.ts'
import { session } from '@/middlewares/sessionMiddleWare.ts'
import type { Router } from 'express'
import express from 'express'

const InstructorRouter: Router = express.Router()

InstructorRouter.route('/me').get(session, getInstructorProfile)
InstructorRouter.route('/register').post(session, registerInstructor)

export default InstructorRouter
