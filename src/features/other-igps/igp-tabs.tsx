"use client"

import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/separators/tabs"
import { MobileTabNav } from "@/components/ui/separators/mobile-tab"
import { IgpSupply } from "@/features/other-igps/igp-supply"
import { Boxes, Store } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"

import { cn } from "@/utils/cn"

import type { TabItem } from "@/components/ui/separators/mobile-tab"

interface IgpTabsProps {
  igpTab?: string
  igpTabLabel?: string
  igpTabShortLabel?: string
  igpTabIcon?: React.ReactNode
  activeTab?: string
  setActiveTab?: (tab: string) => void
  igpManagementContent?: React.ReactNode
}

export const IgpTabs = ({
  igpTab = "igp_management",
  igpTabLabel = "IGP Management",
  igpTabShortLabel = "IGP",
  igpTabIcon = <Store className="size-4" />,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  igpManagementContent,
}: IgpTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(igpTab)
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  // Use either external or internal state
  const activeTab = externalActiveTab || internalActiveTab
  const setActiveTab = externalSetActiveTab || setInternalActiveTab

  const tabs: TabItem[] = [
    {
      id: igpTab,
      label: igpTabLabel,
      shortLabel: igpTabShortLabel,
      icon: igpTabIcon,
    },
    {
      id: "supply",
      label: "Supply",
      shortLabel: "Supply",
      icon: <Boxes className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  return (
    <Tabs
      defaultValue={igpTab}
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
        value={igpTab}
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        {igpManagementContent}
      </TabsContent>

      <TabsContent
        value="supply"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <IgpSupply />
      </TabsContent>
    </Tabs>
  )
}
