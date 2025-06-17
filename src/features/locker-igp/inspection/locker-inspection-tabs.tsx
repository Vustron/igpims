"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/separators/tabs"
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheets"
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import { InspectionClient } from "@/features/locker-igp/inspection/client"
import VisuallyHiddenComponent from "@/components/ui/separators/visually-hidden"
import { Menu, ClipboardList, ChevronsUpDown, InspectIcon } from "lucide-react"

import { Button } from "@/components/ui/buttons"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"

import { cn } from "@/utils/cn"
import { ViolationClient } from "@/features/locker-igp/violations/client"

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

export const LockerInspectionTabs = () => {
  const [activeTab, setActiveTab] = useState("locker_inspection_schedule")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const tabs: TabItem[] = [
    {
      id: "locker_inspection_schedule",
      label: "Locker Inspection Schedule",
      shortLabel: "Locker Inspection",
      icon: <InspectIcon className="size-4" />,
    },
    {
      id: "violator_list",
      label: "Violator List",
      shortLabel: "Violator List",
      icon: <ClipboardList className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  return (
    <Tabs
      defaultValue="locker_inspection_schedule"
      value={activeTab}
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      {/* Desktop and Tablet Navigation */}
      <div className="mb-4 hidden flex-wrap items-center justify-between border-b md:flex">
        <TabsList className="h-10 bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "border-transparent border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-none",
                "h-10 rounded-none px-4 data-[state=active]:border-primary",
                "transition-all duration-200",
              )}
            >
              <span
                className={`flex items-center gap-1.5 ${activeTab === tab.id ? "font-medium text-primary" : "text-muted-foreground"}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Mobile Navigation - Small screens */}
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
                      <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                        Navigation
                      </h3>
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

      {/* Content sections */}
      <TabsContent
        value="locker_inspection_schedule"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <InspectionClient />
      </TabsContent>

      <TabsContent
        value="violator_list"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <ViolationClient />
      </TabsContent>
    </Tabs>
  )
}
