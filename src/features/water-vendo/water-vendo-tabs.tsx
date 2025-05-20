"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/separators/tabs"
import {
  WaterVendoCard,
  exampleWaterVendos,
} from "@/features/water-vendo/water-vendo-card"
import { WaterVendoFilters } from "@/features/water-vendo/water-vendo-filter"
import { WaterSupply } from "@/features/water-vendo/water-supply-list"
import { MobileTabNav } from "@/components/ui/separators/mobile-tab"
import { WaterFunds } from "@/features/water-vendo/water-funds"
import { GiWaterGallon, GiWaterSplash } from "react-icons/gi"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"
import { Search, Plus } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"
import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

import type { FilterState } from "@/features/water-vendo/water-vendo-filter"
import type { TabItem } from "@/components/ui/separators/mobile-tab"

export const WaterVendoTabs = () => {
  const [activeTab, setActiveTab] = useState("water_vendo_monitoring")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: {
      online: false,
      offline: false,
      maintenance: false,
    },
    refill: {
      full: false,
      low: false,
      critical: false,
      empty: false,
    },
    lastRefilled: null,
  })
  const { onOpen } = useDialog()

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const tabs: TabItem[] = [
    {
      id: "water_vendo_monitoring",
      label: "Water Vendo Monitoring",
      shortLabel: "Water Vendo Monitoring",
      icon: <GiWaterGallon className="size-4" />,
    },
    {
      id: "water_supply",
      label: "Water Supply",
      shortLabel: "Water Supply",
      icon: <GiWaterSplash className="size-4" />,
    },
    {
      id: "water_funds",
      label: "Fund Collection",
      shortLabel: "Water Funds",
      icon: <FaMoneyBill1Wave className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  const filterVendos = () => {
    return exampleWaterVendos.filter((vendo) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        vendo.id.toLowerCase().includes(searchLower) ||
        vendo.location.toLowerCase().includes(searchLower) ||
        vendo.vendoStatus.toLowerCase().includes(searchLower) ||
        vendo.refillStatus.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      const statusFiltersActive = Object.values(filters.status).some((v) => v)
      const matchesStatus =
        !statusFiltersActive || filters.status[vendo.vendoStatus]

      if (!matchesStatus) return false

      const refillFiltersActive = Object.values(filters.refill).some((v) => v)
      const matchesRefill =
        !refillFiltersActive || filters.refill[vendo.refillStatus]

      if (!matchesRefill) return false

      return true
    })
  }

  const filteredVendos = filterVendos()

  const totalVendos = exampleWaterVendos.length

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <Tabs
      defaultValue="water_vendo_monitoring"
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
        value="water_vendo_monitoring"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        {/* Search and filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search water vendos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <WaterVendoFilters
              filters={filters}
              setFilters={setFilters}
              totalCount={totalVendos}
              filteredCount={filteredVendos.length}
            />

            <Button
              size="sm"
              className="h-9"
              onClick={() => onOpen("createWaterVendo")}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Vendo
            </Button>
          </div>
        </div>

        {/* Water vendo cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredVendos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <GiWaterGallon className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-medium text-lg">No water vendos found</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
              {Object.values(filters.status).some((v) => v) ||
                Object.values(filters.refill).some((v) => v) ||
                (filters.lastRefilled && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() =>
                      setFilters({
                        status: {
                          online: false,
                          offline: false,
                          maintenance: false,
                        },
                        refill: {
                          full: false,
                          low: false,
                          critical: false,
                          empty: false,
                        },
                        lastRefilled: null,
                      })
                    }
                  >
                    Clear filters
                  </Button>
                ))}
            </div>
          ) : (
            filteredVendos.map((vendo) => (
              <motion.div
                key={vendo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <WaterVendoCard
                  id={vendo.id}
                  location={vendo.location}
                  gallonsUsed={vendo.gallonsUsed}
                  vendoStatus={vendo.vendoStatus}
                  refillStatus={vendo.refillStatus}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </TabsContent>

      <TabsContent
        value="water_supply"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <WaterSupply />
      </TabsContent>

      <TabsContent
        value="water_funds"
        className="fade-in-50 mt-0 animate-in duration-300 focus-visible:outline-none focus-visible:ring-0"
      >
        <WaterFunds />
      </TabsContent>
    </Tabs>
  )
}
