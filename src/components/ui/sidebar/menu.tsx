"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltips"
import { Button, CollapseMenuButton } from "@/components/ui/buttons"
import { ScrollArea } from "@/components/ui/scrollareas"
import { Ellipsis } from "lucide-react"

// import { useSignOutUser } from "@/backend/actions/user/sign-out"
import { usePathname } from "next/navigation"

import { getMenuList } from "@/components/ui/sidebar"
// import { catchError } from "@/utils/catch-error"
// import toast from "react-hot-toast"
import { cn } from "@/utils/cn"
import Link from "next/link"

interface MenuProps {
  isOpen: boolean | undefined
}

export const Menu = ({ isOpen }: MenuProps) => {
  const pathname = usePathname()
  // const signOut = useSignOutUser()
  const menuList = getMenuList(pathname)

  // const handleLogout = async () => {
  //   await toast.promise(signOut.mutateAsync(), {
  //     loading: <span className="animate-pulse">Signing out...</span>,
  //     success: "Signed out successfully",
  //     error: (error: unknown) => catchError(error),
  //   })
  // }
  return (
    <ScrollArea className="[&>div>div[style]]:block! text-white">
      <nav className="mt-2">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="max-w-[280px] truncate px-4 pb-2 font-medium text-gray-400 text-sm">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2" />
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={cn(
                                "mb-1 h-10 w-full justify-start",
                                active
                                  ? "bg-[#2E2B16] text-white hover:bg-[#2E2B16]/50"
                                  : "hover:bg-[#2E2B16]/50 hover:text-white",
                              )}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(
                                    isOpen === false ? "-ml-1" : "mr-1",
                                  )}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[250px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100",
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
          {/* <li className="mt-10 flex w-full grow flex-col items-end">
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="mt-1 h-10 w-full justify-center"
                  disabled={signOut.isPending}
                >
                  {signOut.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <LogOut size={18} />
                      </span>

                      <p
                        className={cn(
                          "whitespace-nowrap",
                          isOpen === false ? "hidden opacity-0" : "opacity-100",
                        )}
                      >
                        Sign out
                      </p>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent side="right">Sign out</TooltipContent>
              )}
            </Tooltip>
          </li> */}
        </ul>
      </nav>
    </ScrollArea>
  )
}
