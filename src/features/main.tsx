"use client"

import {
  Key,
  Mail,
  Clock,
  Globe,
  LogOut,
  XCircle,
  Monitor,
  Calendar,
  Loader2Icon,
  CheckCircle2,
  User as FallbackUser,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/images"
import { Card, CardHeader, CardContent } from "@/components/ui/cards"
import { Button } from "@/components/ui/buttons"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"
import Link from "next/link"

import { useFindAccountById } from "@/backend/actions/user/find-by-id"
import { useSignOutUser } from "@/backend/actions/user/sign-out"
import { useDialog } from "@/hooks/use-dialog"
import { useEffect } from "react"

import type { PresentedSession } from "@/schemas/user"
import { ChangeThemeButton } from "@/components/ui/buttons/change-theme-button"

interface MainProps {
  id: string
  session: PresentedSession
}

const Main = ({ id, session }: MainProps) => {
  const { data: user, isLoading } = useFindAccountById(id)
  const signOut = useSignOutUser()
  const { onOpen } = useDialog()

  useEffect(() => {
    if (user && !isLoading) {
      if (!user.emailVerified) {
        onOpen("needVerifyUser")
      }
      if (user.sessionExpired) {
        onOpen("sessionExpired")
      }
    }
  }, [isLoading, onOpen, user])

  const handleSignOut = async () => {
    await toast.promise(signOut.mutateAsync(), {
      loading: "Signing out...",
      success: "Signed out successfully",
      error: (error: unknown) => catchError(error),
    })
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mb-6 w-[400px] shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="outline"
              className="relative size-16 rounded-full p-0"
            >
              <Avatar className="size-16 transition-transform hover:scale-110">
                <Link
                  href="/user"
                  className="flex h-full w-full items-center justify-center"
                >
                  <AvatarImage src={user?.image!} alt="Avatar" />
                  <AvatarFallback className="flex h-full w-full items-center justify-center">
                    <FallbackUser className="size-8" />
                  </AvatarFallback>
                </Link>
              </Avatar>
            </Button>
            <h2 className="font-bold text-2xl">{user?.name}</h2>
            <ChangeThemeButton />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span className="font-semibold">Email:</span>
              <span className="text-gray-600 dark:text-gray-300">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {user?.emailVerified ? (
                <CheckCircle2 className="size-4 text-green-500" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}
              <span className="font-semibold">Status:</span>
              <span
                className={`${user?.emailVerified ? "text-green-500" : "text-red-500"}`}
              >
                {user?.emailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span className="font-semibold">Member since:</span>
              <span className="text-gray-600 dark:text-gray-300">
                {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg">
              <Key className="size-5" />
              Session Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="size-4" />
                <span className="font-medium">IP Address:</span>
                <span className="font-mono text-gray-600 dark:text-gray-300">
                  {session.ipAddress || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="size-4" />
                <span className="font-medium">Browser:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {session.userAgent?.split("/")[0] || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span className="font-medium">Expires:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(session.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            className="mt-6 w-full"
            disabled={signOut.isPending}
          >
            {signOut.isPending ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default Main
