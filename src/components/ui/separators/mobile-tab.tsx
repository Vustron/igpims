"use client"

import { ChevronsUpDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawers"
import { TabsList, TabsTrigger } from "@/components/ui/separators"
import VisuallyHiddenComponent from "@/components/ui/separators/visually-hidden"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheets"
import { cn } from "@/utils/cn"

export interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

interface MobileTabNavProps {
  tabs: TabItem[]
  activeTab: string
  setActiveTab: (id: string) => void
  openMobileSheet: boolean
  setOpenMobileSheet: (open: boolean) => void
  isMobile: boolean
  isSmallScreen: boolean
}

export function MobileTabNav({
  tabs,
  activeTab,
  setActiveTab,
  openMobileSheet,
  setOpenMobileSheet,
  isMobile,
  isSmallScreen,
}: MobileTabNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-background pt-1 pb-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.find((tab) => tab.id === activeTab)?.icon}
          <h2 className="max-w-[200px] truncate font-medium text-lg">
            {isSmallScreen
              ? tabs.find((tab) => tab.id === activeTab)?.shortLabel
              : tabs.find((tab) => tab.id === activeTab)?.label}
          </h2>
        </div>

        {isMobile ? (
          <Drawer open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-4 pt-4 pb-6">
              <VisuallyHiddenComponent>
                <DrawerHeader className="text-center">
                  <DrawerTitle>
                    <span className="mb-2 font-medium text-muted-foreground text-sm">
                      Navigation
                    </span>
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground">
                    Select a tab to navigate
                  </DrawerDescription>
                </DrawerHeader>
              </VisuallyHiddenComponent>
              <div className="flex flex-col space-y-1.5">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    className="h-10 justify-start"
                    onClick={() => {
                      setActiveTab(tab.id)
                      setOpenMobileSheet(false)
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
            <VisuallyHiddenComponent>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription />
            </VisuallyHiddenComponent>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:hidden"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[340px]">
              <div className="flex flex-col gap-4 py-2">
                <h2 className="font-medium text-lg">Navigation</h2>
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab(tab.id)
                      setOpenMobileSheet(false)
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Mobile Tab Pills - Medium screens */}
      <div className="scrollbar-hide mt-3 hidden overflow-x-auto pb-1 sm:flex md:hidden">
        <TabsList className="h-8 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "h-8 rounded-full px-3 text-xs data-[state=active]:bg-primary/10",
                "border border-muted data-[state=active]:border-primary/30",
                "whitespace-nowrap",
              )}
            >
              <span
                className={`flex items-center gap-1.5 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.icon}
                <span>{tab.shortLabel || tab.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  )
}
