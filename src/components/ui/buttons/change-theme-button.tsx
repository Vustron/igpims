"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/buttons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"

export const ChangeThemeButton = () => {
  const { setTheme, theme } = useTheme()
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          className="size-8 rounded-full hover:bg-black/20"
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-white transition-transform duration-500 ease-in-out hover:text-black dark:rotate-0 dark:scale-100" />

          <Sun className="dark:-rotate-90 absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-white transition-transform duration-500 ease-in-out dark:scale-0" />
          <span className="sr-only">Switch Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Switch Theme</TooltipContent>
    </Tooltip>
  )
}
