"use client"

import { Button, ChangeThemeButton, UserButton } from "@/components/ui/buttons"
import { SheetMenu } from "@/components/ui/sidebar"
import { BellDot } from "lucide-react"

import type React from "react"

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
          <NavbarItem>
            <ChangeThemeButton />
          </NavbarItem>
          <NavbarItem>
            <Button
              variant="ghost"
              size="icon"
              className="text-white transition-colors hover:text-black"
            >
              <BellDot className="size-5" />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <UserButton />
          </NavbarItem>
        </div>
      </nav>
    </header>
  )
}
