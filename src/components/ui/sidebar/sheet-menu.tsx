import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheets"
import VisuallyHiddenComponent from "@/components/ui/separators/visually-hidden"
import { Menu } from "@/components/ui/sidebar/menu"
import { Button } from "@/components/ui/buttons"
import { MenuIcon } from "lucide-react"

import Image from "next/image"
import Link from "next/link"

export const SheetMenu = () => {
  return (
    <Sheet>
      <VisuallyHiddenComponent>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription />
      </VisuallyHiddenComponent>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md sm:w-72 dark:shadow-zinc-800"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex items-center justify-center pt-10 pb-7"
            variant="link"
            asChild
          >
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="logo"
                priority
                height={80}
                width={80}
                sizes="100vh"
                className={
                  "rounded-full object-contain transition-all duration-300 ease-in-out"
                }
              />
              <span className="font-semibold text-base transition-opacity duration-300">
                IGPMIS
              </span>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
