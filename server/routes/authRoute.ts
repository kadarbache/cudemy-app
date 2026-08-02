import express from 'express'
import type { Router } from 'express'
import {
  logoutUser,
  signinEmail,
  signupEmailAndPassword,
} from '@/controllers/betterAuthController.ts'
const authRouter: Router = express.Router()

authRouter.route('/sign-up/email').post(signupEmailAndPassword)
authRouter.route('/sign-in/email').post(signinEmail)
authRouter.route('/sign-out').post(logoutUser)

export default authRouter

/*
{
    "name":"kadar naruto",
    "email":"kadar3@gmail.com",
    "password":"naruto6160"
}
*/
