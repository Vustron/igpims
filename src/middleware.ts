import { unsealData } from "iron-session"
import { NextRequest, NextResponse } from "next/server"
import { isEmptySession, SessionType, sessionOptions } from "@/config/session"

export const protectedRoutes: string[] = [
  "/",
  "/current-user",
  "/locker-rental",
  "/water-vendo",
  "/other-igps",
  "/other-igps/*",
  "/fund-request",
  "/notification",
  "/project-approval",
  "/report",
  "/users",
  "/users/*",
  "/email",
]
export const authRoutes: string[] = [
  "/sign-in",
  "/sign-up",
  "/verify",
  "/reset-password",
]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)
  const authSessionCookie = request.cookies.get("auth-session")?.value

  let isValidSession = false

  if (authSessionCookie) {
    try {
      const sessionData = await unsealData<SessionType>(authSessionCookie, {
        password: sessionOptions.password,
      })
      isValidSession = !isEmptySession(sessionData)
    } catch {
      isValidSession = false
    }
  }

  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isProtectedRoute && !isValidSession) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
