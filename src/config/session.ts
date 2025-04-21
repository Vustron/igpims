import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { env } from "@/config/env"

import type { IronSession, SessionOptions } from "iron-session"
import type { session } from "@/schemas/drizzle-schema"
import type { InferSelectModel } from "drizzle-orm"

export type SessionType = InferSelectModel<typeof session>

export const sessionOptions: SessionOptions = {
  password: env.SECRET_KEY!,
  cookieName: "auth-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
  },
}

export const defaultSession: SessionType = {
  id: "",
  expiresAt: new Date(),
  token: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "",
  userId: "",
}

export const getSession = async (): Promise<IronSession<SessionType>> => {
  const session = await getIronSession<SessionType>(
    await cookies(),
    sessionOptions,
  )

  if (!session.id) {
    session.id = defaultSession.id
    session.expiresAt = defaultSession.expiresAt
    session.token = defaultSession.token
    session.createdAt = defaultSession.createdAt
    session.updatedAt = defaultSession.updatedAt
    session.ipAddress = defaultSession.ipAddress
    session.userAgent = defaultSession.userAgent
    session.userId = defaultSession.userId
  }

  return session
}

export const isEmptySession = (session: SessionType): boolean => {
  return (
    !session.id ||
    !session.token ||
    !session.userId ||
    session.id === defaultSession.id ||
    session.token === defaultSession.token ||
    session.userId === defaultSession.userId
  )
}
