"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/separators/tabs"
import { LockerRentalClient } from "@/features/locker-rental/client"
import { ClipboardList, ListCheckIcon, Receipt } from "lucide-react"
import { PiLockers } from "react-icons/pi"

import { useState } from "react"

export const LockerRentalTabs = () => {
  const [activeTab, setActiveTab] = useState("locker_rental_management")

  return (
    <Tabs
      defaultValue="locker_rental_management"
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="h-10 w-full sm:w-auto">
          <TabsTrigger
            value="locker_rental_management"
            className="min-w-[100px] flex-1 gap-1.5 sm:flex-initial"
          >
            <PiLockers
              className={`size-4 ${activeTab === "locker_rental_management" ? "text-primary" : ""}`}
            />
            <span>Locker Rental Management</span>
          </TabsTrigger>
          <TabsTrigger
            value="locker_rental_list"
            className="min-w-[100px] flex-1 gap-1.5 sm:flex-initial"
          >
            <ClipboardList
              className={`size-4 ${activeTab === "locker_rental_list" ? "text-primary" : ""}`}
            />
            <span>Locker Rental List</span>
          </TabsTrigger>
          <TabsTrigger
            value="locker_inspection"
            className="min-w-[100px] flex-1 gap-1.5 sm:flex-initial"
          >
            <Receipt
              className={`size-4 ${activeTab === "locker_inspection" ? "text-primary" : ""}`}
            />
            <span>Locker Inspection Schedule</span>
          </TabsTrigger>
          <TabsTrigger
            value="violator_list"
            className="min-w-[100px] flex-1 gap-1.5 sm:flex-initial"
          >
            <ListCheckIcon
              className={`size-4 ${activeTab === "violator_list" ? "text-primary" : ""}`}
            />
            <span>Violator List</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="locker_rental_management"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <LockerRentalClient />
      </TabsContent>

      <TabsContent
        value="rentals"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <h1>Rentals</h1>
      </TabsContent>

      <TabsContent
        value="payments"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <h1>Payments</h1>
      </TabsContent>

      <TabsContent
        value="settings"
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <h1>Settings</h1>
      </TabsContent>
    </Tabs>
  )
}
