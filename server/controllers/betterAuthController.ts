import { auth } from '@/lib/auth.ts'
import type { Request, Response } from 'express'
import { APIError } from 'better-auth/api'
import { fromNodeHeaders } from 'better-auth/node'

export async function signupEmailAndPassword(
  req: Request<
    {},
    {},
    { name: string; email: string; password: string; image: string }
  >,
  res: Response,
) {
  try {
    const { name, email, password, image } = req.body

    const data = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        name,
        email,
        password,
        image: image ? image : '/assets/default.png',
      },
    })

    const cookie = data.headers.get('set-cookie')
    if (!cookie) return res.status(401).json({ message: 'invalid credentials' })
    res.setHeader('Set-Cookie', cookie)

    return res
      .status(201)
      .json({ status: 'success', message: 'signed in the user', data })
  } catch (error) {
    if (error instanceof APIError) {
      return res
        .status(401)
        .json({ code: error?.body?.code, message: error.body?.message })
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Internal Server Error' })
    }
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const data = await auth.api.signOut({
      asResponse: true,
      headers: fromNodeHeaders(req.headers),
    })

    const cookie = data.headers.get('set-cookie')
    if (cookie) res.setHeader('Set-Cookie', cookie)

    return res.status(200).json({
      status: 'success',
      message: 'signed out the user',
    })
  } catch (error) {
    if (error instanceof APIError) {
      return res
        .status(401)
        .json({ code: error?.body?.code, message: error.body?.message })
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'Internal Server Error' })
    }
  }
}

export async function signinEmail(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const data = await auth.api.signInEmail({
      asResponse: true,
      body: {
        email,
        password,
      },
    })

    if (!data) {
      return res.status(401).json({
        status: 'error',
        message: 'invalid credentials',
      })
    }
    const cookie = data.headers.get('set-cookie')
    if (!cookie)
      return res
        .status(401)
        .json({ status: 'error', message: 'invalid credentials' })
    res.setHeader('Set-Cookie', cookie)

    return res.status(200).json({
      status: 'success',
      message: 'signed in the user',
      data: data,
    })
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Error during sign-in:', error.body)
      return res.status(401).json({
        status: 'error',
        message: error.body?.message,
        code: error.body?.code,
      })
    } else {
      console.error('Internal server error during sign-in:', error)
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' })
    }
  }
}
