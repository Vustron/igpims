"use client"

import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/separators/tabs"
import { MobileTabNav } from "@/components/ui/separators/mobile-tab"

import { ClipboardList, FileX } from "lucide-react"
import { GiMagnifyingGlass } from "react-icons/gi"
import { PiLockers } from "react-icons/pi"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"

import { InspectionClient } from "./inspection/client"
import { ViolationClient } from "./violations/client"
import { LockerRentClient } from "./rent/client"
import { LockersClient } from "./lockers/client"

import { cn } from "@/utils/cn"

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

export const LockerIgpClient = () => {
  const [activeTab, setActiveTab] = useState("locker_rental_management")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const tabs: TabItem[] = [
    {
      id: "locker_rental_management",
      label: "Lockers",
      shortLabel: "Rental Lockers",
      icon: <PiLockers className="size-4" />,
    },
    {
      id: "locker_rental_list",
      label: "Rental List",
      shortLabel: "Rental List",
      icon: <ClipboardList className="size-4" />,
    },
    {
      id: "locker_inspection_schedule",
      label: "Inspection Schedules",
      shortLabel: "Inspection Schedules",
      icon: <GiMagnifyingGlass className="size-4" />,
    },
    {
      id: "violator_list",
      label: "Violator List",
      shortLabel: "Violator List",
      icon: <FileX className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  return (
    <Tabs
      defaultValue="locker_rental_management"
      value={activeTab}
      className="mt-1 w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      {/* Desktop and Tablet Navigation */}
      <div className="hidden flex-wrap items-center justify-between border-b md:flex">
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

      {/* Mobile Navigation */}
      <MobileTabNav
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMobileSheet={openMobileSheet}
        setOpenMobileSheet={setOpenMobileSheet}
        isMobile={isMobile}
        isSmallScreen={isSmallScreen}
      />

      {/* Content sections */}
      <TabsContent
        value="locker_rental_management"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <LockersClient />
      </TabsContent>

      <TabsContent
        value="locker_rental_list"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <LockerRentClient />
      </TabsContent>

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
