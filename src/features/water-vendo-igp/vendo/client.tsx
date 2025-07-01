"use client"

import { motion } from "framer-motion"
import { Loader2, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { GiWaterGallon, GiWaterSplash } from "react-icons/gi"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"
import { MobileTabNav, TabItem } from "@/components/ui/separators/mobile-tab"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/separators/tabs"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/utils/cn"
import { WaterVendoCard } from "./water-vendo-card"
import { FilterState, WaterVendoFilters } from "./water-vendo-filter"
import { WaterFunds } from "../funds/client"
import { WaterSupply } from "../supply/water-supply-list"

const isVendoStatus = (
  status: string,
): status is "operational" | "maintenance" | "out-of-service" | "offline" => {
  return ["operational", "maintenance", "out-of-service", "offline"].includes(
    status,
  )
}

const isWaterRefillStatus = (
  status: string,
): status is "full" | "medium" | "low" | "empty" => {
  return ["full", "medium", "low", "empty"].includes(status)
}

export const WaterVendoClient = () => {
  const [activeTab, setActiveTab] = useState("water_vendo_monitoring")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: {
      operational: false,
      maintenance: false,
      "out-of-service": false,
      offline: false,
    },
    refill: {
      full: false,
      medium: false,
      low: false,
      empty: false,
    },
    lastRefilled: null,
  })
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const { onOpen } = useDialog()

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const vendoStatusParam =
    Object.entries(filters.status)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(",") || undefined

  const waterRefillStatusParam =
    Object.entries(filters.refill)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(",") || undefined

  const { data: vendosData, isLoading } = useFindManyWaterVendos({
    page,
    limit,
    search: searchQuery,
    vendoStatus: vendoStatusParam as any,
    waterRefillStatus: waterRefillStatusParam as any,
  })

  const safeVendosData = vendosData
    ? {
        ...vendosData,
        data: vendosData.data.map((vendo) => ({
          ...vendo,
          vendoStatus: isVendoStatus(vendo.vendoStatus)
            ? vendo.vendoStatus
            : "offline",
          waterRefillStatus: isWaterRefillStatus(vendo.waterRefillStatus)
            ? vendo.waterRefillStatus
            : "empty",
        })),
        meta: {
          ...vendosData.meta,
          hasPrevPage: vendosData.meta.page > 1,
          hasNextPage: vendosData.meta.page < vendosData.meta.totalPages,
        },
      }
    : undefined

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

  useEffect(() => {
    setPage(1)
  }, [filters, searchQuery])

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
              totalCount={safeVendosData?.meta.totalItems || 0}
              filteredCount={safeVendosData?.data.length || 0}
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
          {isLoading ? (
            <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center">
              <Loader2 className="size-12 animate-spin" />
            </div>
          ) : safeVendosData?.data.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <GiWaterGallon className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-medium text-lg">No water vendos found</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
              {(Object.values(filters.status).some((v) => v) ||
                Object.values(filters.refill).some((v) => v) ||
                filters.lastRefilled) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setFilters({
                      status: {
                        operational: false,
                        maintenance: false,
                        "out-of-service": false,
                        offline: false,
                      },
                      refill: {
                        full: false,
                        medium: false,
                        low: false,
                        empty: false,
                      },
                      lastRefilled: null,
                    })
                    setSearchQuery("")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            safeVendosData?.data.map((vendo) => (
              <motion.div
                key={vendo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <WaterVendoCard
                  id={vendo.id}
                  location={vendo.waterVendoLocation}
                  gallonsUsed={vendo.gallonsUsed}
                  vendoStatus={vendo.vendoStatus}
                  waterRefillStatus={vendo.waterRefillStatus}
                  createdAt={vendo.createdAt}
                  updatedAt={vendo.updatedAt}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination Controls */}
        {safeVendosData?.meta?.totalPages &&
          safeVendosData.meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-2">
                Page {safeVendosData.meta.page} of{" "}
                {safeVendosData.meta.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= safeVendosData.meta.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
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
