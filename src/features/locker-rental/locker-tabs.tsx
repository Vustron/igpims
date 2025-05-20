"use client"

import { LockerRentalListClient } from "@/features/locker-rental-list/client"
import { MobileTabNav } from "@/components/ui/separators/mobile-tab"
import { LockerRentalClient } from "@/features/locker-rental/client"
import { Tabs, TabsContent } from "@/components/ui/separators/tabs"
import { ClipboardList } from "lucide-react"

import { PiLockers } from "react-icons/pi"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

export const LockerRentalTabs = () => {
  const [activeTab, setActiveTab] = useState("locker_rental_management")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const tabs: TabItem[] = [
    {
      id: "locker_rental_management",
      label: "Locker Rental Management",
      shortLabel: "Rental Management",
      icon: <PiLockers className="size-4" />,
    },
    {
      id: "locker_rental_list",
      label: "Locker Rental List",
      shortLabel: "Rental List",
      icon: <ClipboardList className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  return (
    <Tabs
      defaultValue="locker_rental_management"
      value={activeTab}
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
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
        <LockerRentalClient />
      </TabsContent>

      <TabsContent
        value="locker_rental_list"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <LockerRentalListClient />
      </TabsContent>
    </Tabs>
  )
}
