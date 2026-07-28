import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { ObjectId } from 'mongodb'
import prisma from './prisma.ts'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    disableSessionRefresh: true,
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: () => new ObjectId().toString(), // Default is `crypto.randomUUID()`
    },
    defaultCookieAttributes: {
      SameSite: 'Lax',
      secure: true,
      httpOnly: true,
    },
  },
  user: {
    additionalFields: {
      roles: {
        type: 'string[]',
        input: false,
      },
      secret: {
        type: 'string',
        input: false,
      },
      language: {
        type: 'string',
        input: false,
      },
    },
  },
  trustedOrigins: ['http://localhost:3001'],
})
