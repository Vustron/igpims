"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltips"
import { LogOut, UserCog, Loader2, User as FallbackUser } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/images"
import { Button } from "@/components/ui/buttons"

import { useFindAccountById } from "@/backend/actions/user/find-by-id"
import { useSignOutUser } from "@/backend/actions/user/sign-out"
import { useSession } from "@/components/context/session"
import { useDialog } from "@/hooks/use-dialog"
import { useRouter } from "next-nprogress-bar"
import { useEffect } from "react"

import { catchError } from "@/utils/catch-error"

import toast from "react-hot-toast"
import Link from "next/link"

export const UserButton = () => {
  const session = useSession()
  const {
    data: user,
    isLoading,
    error,
    status,
  } = useFindAccountById(session.userId)
  const router = useRouter()
  const signOut = useSignOutUser()
  const { onOpen } = useDialog()

  useEffect(() => {
    if (user && !isLoading) {
      if (user.sessionExpired) {
        onOpen("sessionExpired")
      }
    }
  }, [isLoading, onOpen, user])

  const handleSignOut = async () => {
    await toast.promise(signOut.mutateAsync(), {
      loading: <span className="animate-pulse">Signing out...</span>,
      success: "Signed out successfully",
      error: (error: unknown) => catchError(error),
    })
    router.replace("/sign-in")
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            {isLoading ? (
              <Loader2 className="size-10 animate-spin" />
            ) : status === "error" ? (
              <span className="absolute inset-0 flex items-center justify-center">
                {error?.message}
              </span>
            ) : (
              status === "success" && (
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative flex h-8 items-center gap-2 rounded-full pr-3 pl-1"
                  >
                    <Avatar className="size-7 hover:scale-110">
                      <AvatarImage src={user?.image!} alt="Avatar" />
                      <AvatarFallback className="bg-transparent">
                        <FallbackUser className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="mr-2 max-w-[100px] truncate font-medium text-sm">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              )
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-[250px] border-none bg-[#4A4520] shadow-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <h2 className="font-extrabold text-white leading-none">
              {user?.name}
            </h2>
            <h6 className="text-gray-400 text-xs leading-none">
              {user?.email}
            </h6>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0 focus:bg-transparent">
            <Link
              href="/current-user"
              className="flex w-full items-center rounded px-2 py-1.5 text-white hover:bg-[#2E2B16] hover:font-bold"
            >
              <UserCog className="mr-3 size-4 text-white" />
              Edit profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="ml-[5px] w-[230px]" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="p-0 focus:bg-transparent"
        >
          <div className="flex w-full items-center rounded px-2 py-1.5 text-white hover:bg-[#2E2B16] hover:font-bold">
            <LogOut className="mr-3 size-4 text-white" />
            Sign out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
