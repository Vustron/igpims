import { session } from "@/backend/db/schemas"
import { env } from "@/config/env"
import { InferSelectModel } from "drizzle-orm"
import { IronSession, SessionOptions, getIronSession } from "iron-session"
import { cookies } from "next/headers"

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
  userRole: "",
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
    session.userRole = defaultSession.userRole
  }

  return session
}

export const isEmptySession = (session: SessionType): boolean => {
  return (
    !session.id ||
    !session.token ||
    !session.userId ||
    !session.userRole ||
    session.id === defaultSession.id ||
    session.token === defaultSession.token ||
    session.userId === defaultSession.userId ||
    session.userRole === defaultSession.userRole
  )
}
