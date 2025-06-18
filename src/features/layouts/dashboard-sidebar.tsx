"use client"

import { Footer } from "@/features/layouts/footer"
import { Sidebar } from "@/components/ui/sidebar"

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"
import { useStore } from "@/hooks/use-store"

import { cn } from "@/utils/cn"

export const DashboardSideBar = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const sidebar = useStore(useSidebarToggle, (state) => state)
  if (!sidebar) return null
  return (
    <div>
      <Sidebar />
      <main
        className={cn(
          "z-20 min-h-[calc(100vh-56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-[240px]",
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-[240px]",
        )}
      >
        <Footer />
      </footer>
    </div>
  )
}
