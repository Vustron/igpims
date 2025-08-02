"use client"

import { Badge } from "@/components/ui/badges"
import { Button, ChangeThemeButton, UserButton } from "@/components/ui/buttons"
import { SheetMenu } from "@/components/ui/sidebar"
import {
  useNotificationCount,
  useNotificationStore,
} from "@/features/notification/notification-store"
import { cn } from "@/utils/cn"
import { BellDot } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import React from "react"

interface NavbarProps {
  title: string
}

interface NavbarItemProps {
  children: React.ReactNode
}

const NavbarItem: React.FC<NavbarItemProps> = ({ children }) => (
  <div className="transition-transform active:scale-95">{children}</div>
)

export const Navbar = ({ title }: NavbarProps) => {
  const router = useRouter()
  const unreadCount = useNotificationStore((state) => state.unreadCount)

  useNotificationCount()

  return (
    <header className="sticky top-0 z-20 w-full bg-[#3D3A24] shadow-sm backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold text-lg text-white md:text-xl lg:text-2xl">
            {title}
          </h1>
        </div>

        <div className="mr-5 flex items-center gap-5">
          {process.env.NODE_ENV === "development" && (
            <NavbarItem>
              <ChangeThemeButton />
            </NavbarItem>
          )}
          <NavbarItem>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white transition-colors hover:text-black"
                onClick={() => router.push("/notification")}
              >
                <BellDot className="size-5" />
              </Button>

              {unreadCount > 0 && (
                <Badge
                  variant="info"
                  className={cn(
                    "-right-1 -top-1 absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-medium text-white text-xs",
                    unreadCount > 99 ? "px-1.5" : "",
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
          </NavbarItem>
          <NavbarItem>
            <UserButton />
          </NavbarItem>
        </div>
      </nav>
    </header>
  )
}
