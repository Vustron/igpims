import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { Menu } from "@/components/ui/sidebar/menu"
import { SidebarToggle } from "@/components/ui/sidebar/sidebar-toggle"
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"
import { useStore } from "@/hooks/use-store"
import { cn } from "@/utils/cn"

export const Sidebar = () => {
  const sidebar = useStore(useSidebarToggle, (state) => state)
  if (!sidebar) return null
  return (
    <aside
      className={cn(
        "-translate-x-full fixed top-0 left-0 z-30 h-screen bg-[#4A4520] transition-[width] duration-300 ease-in-out lg:translate-x-0",
        sidebar?.isOpen === false ? "w-[90px]" : "w-[240px]",
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto bg-[#4A4520] px-3 py-4 shadow-md ">
        <Button
          className={cn(
            "mb-1 transition-all duration-300 ease-in-out",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="logo"
              priority
              height={200}
              width={200}
              sizes="100vh"
              className={cn(
                "rounded-full object-contain transition-all duration-300 ease-in-out",
                sidebar?.isOpen === false ? "size-8" : "size-12",
              )}
            />
            {sidebar?.isOpen && (
              <span className="font-semibold text-base text-white transition-opacity duration-300">
                IGPIMS
              </span>
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}
