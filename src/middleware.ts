import { SessionType, isEmptySession, sessionOptions } from "@/config/session"
import { UserRole } from "@/types/user"
import { unsealData } from "iron-session"
import { NextRequest, NextResponse } from "next/server"

const roleProtectedRoutes: Record<UserRole, string[]> = {
  admin: [
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
  ],
  ssc_president: [
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
  ],
  dpdm_secretary: ["/", "/current-user", "/notification"],
  dpdm_officers: ["/", "/current-user", "/fund-request", "/notification"],
  ssc_treasurer: [
    "/",
    "/current-user",
    "/fund-request",
    "/notification",
    "/report",
  ],
  ssc_auditor: ["/", "/current-user", "/notification", "/report"],
  chief_legislator: [
    "/",
    "/current-user",
    "/fund-request",
    "/notification",
    "/project-approval",
  ],
  legislative_secretary: [
    "/",
    "/current-user",
    "/fund-request",
    "/notification",
    "/project-approval",
  ],
  ssc_officer: ["/", "/current-user", "/notification"],
  student: ["/", "/current-user", "/notification"],
  user: ["/", "/current-user", "/notification"],
}

export const protectedRoutes = Object.values(roleProtectedRoutes).flat()
export const authRoutes = ["/sign-in", "/sign-up", "/verify", "/reset-password"]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)
  const authSessionCookie = request.cookies.get("auth-session")?.value

  let isValidSession = false
  let userRole: UserRole | null = null
  let sessionData: SessionType | null = null

  if (authSessionCookie) {
    try {
      sessionData = await unsealData<SessionType>(authSessionCookie, {
        password: sessionOptions.password,
      })
      isValidSession = !isEmptySession(sessionData)
      userRole = (sessionData?.userRole as UserRole) || null
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

  if (isValidSession && userRole && isProtectedRoute) {
    const allowedRoutes = roleProtectedRoutes[userRole]
    const isRouteAllowed = allowedRoutes.some(
      (allowedPath) =>
        path === allowedPath ||
        (allowedPath.endsWith("/*") &&
          path.startsWith(allowedPath.slice(0, -2))),
    )

    if (!isRouteAllowed) {
      const fallbackRoute = allowedRoutes[0] || "/"
      return NextResponse.redirect(new URL(fallbackRoute, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
