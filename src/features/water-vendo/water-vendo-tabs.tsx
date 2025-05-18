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
import {
  WaterVendoCard,
  exampleWaterVendos,
} from "@/features/water-vendo/water-vendo-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import VisuallyHiddenComponent from "@/components/ui/separators/visually-hidden"
import { Menu, Filter, Search, Plus, X, ChevronsUpDown } from "lucide-react"
import { WaterSupply } from "@/features/water-vendo/water-supply-list"
import { WaterFunds } from "@/features/water-vendo/water-funds"
import { GiWaterGallon, GiWaterSplash } from "react-icons/gi"
import { Separator } from "@/components/ui/separators"
import { Checkbox } from "@/components/ui/checkboxes"
import { FaMoneyBill1Wave } from "react-icons/fa6"
import { Button } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import { Input } from "@/components/ui/inputs"
import { Badge } from "@/components/ui/badges"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"
import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

type FilterState = {
  status: {
    online: boolean
    offline: boolean
    maintenance: boolean
  }
  refill: {
    full: boolean
    low: boolean
    critical: boolean
    empty: boolean
  }
  lastRefilled: string | null
}

export const WaterVendoTabs = () => {
  const [activeTab, setActiveTab] = useState("water_vendo_monitoring")
  const [openMobileSheet, setOpenMobileSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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
      label: "Fund Colection",
      shortLabel: "Water Funds",
      icon: <FaMoneyBill1Wave className="size-4" />,
    },
  ]

  useEffect(() => {
    setOpenMobileSheet(false)
  }, [activeTab])

  // Check if any filter is active
  const isFilterActive = () => {
    const statusActive = Object.values(filters.status).some((v) => v)
    const refillActive = Object.values(filters.refill).some((v) => v)
    return statusActive || refillActive || !!filters.lastRefilled
  }

  // Get count of active filters
  const activeFilterCount = () => {
    const statusCount = Object.values(filters.status).filter((v) => v).length
    const refillCount = Object.values(filters.refill).filter((v) => v).length
    const lastRefilledCount = filters.lastRefilled ? 1 : 0
    return statusCount + refillCount + lastRefilledCount
  }

  // Reset all filters
  const resetFilters = () => {
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

  // Toggle individual filter
  const toggleFilter = (
    category: "status" | "refill",
    key: string,
    value: boolean,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  // Set last refilled filter
  const setLastRefilledFilter = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      lastRefilled: value,
    }))
  }

  // Filter water vendos based on search query and filters
  const filterVendos = () => {
    return exampleWaterVendos.filter((vendo) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        vendo.id.toLowerCase().includes(searchLower) ||
        vendo.location.toLowerCase().includes(searchLower) ||
        vendo.vendoStatus.toLowerCase().includes(searchLower) ||
        vendo.refillStatus.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Status filter
      const statusFiltersActive = Object.values(filters.status).some((v) => v)
      const matchesStatus =
        !statusFiltersActive || filters.status[vendo.vendoStatus]

      if (!matchesStatus) return false

      // Refill status filter
      const refillFiltersActive = Object.values(filters.refill).some((v) => v)
      const matchesRefill =
        !refillFiltersActive || filters.refill[vendo.refillStatus]

      if (!matchesRefill) return false

      return true
    })
  }

  const filteredVendos = filterVendos()

  // Calculate stats for summary
  const totalVendos = exampleWaterVendos.length
  const onlineVendos = exampleWaterVendos.filter(
    (v) => v.vendoStatus === "online",
  ).length
  const criticalVendos = exampleWaterVendos.filter(
    (v) => v.refillStatus === "critical" || v.refillStatus === "empty",
  ).length

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
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative h-9",
                    isFilterActive() && "border-primary/50 bg-primary/5",
                  )}
                >
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  Filter
                  {isFilterActive() && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs"
                    >
                      {activeFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="end">
                <div className="flex items-center justify-between border-b p-3">
                  <div className="font-medium text-sm">Filter Vendos</div>
                  {isFilterActive() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  )}
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {/* Vendo Status Filter */}
                    <div>
                      <h4 className="mb-2 font-medium text-sm">Vendo Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="status-online"
                            checked={filters.status.online}
                            onCheckedChange={(checked) =>
                              toggleFilter("status", "online", checked === true)
                            }
                          />
                          <Label
                            htmlFor="status-online"
                            className="ml-2 text-sm"
                          >
                            Online
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="status-offline"
                            checked={filters.status.offline}
                            onCheckedChange={(checked) =>
                              toggleFilter(
                                "status",
                                "offline",
                                checked === true,
                              )
                            }
                          />
                          <Label
                            htmlFor="status-offline"
                            className="ml-2 text-sm"
                          >
                            Offline
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="status-maintenance"
                            checked={filters.status.maintenance}
                            onCheckedChange={(checked) =>
                              toggleFilter(
                                "status",
                                "maintenance",
                                checked === true,
                              )
                            }
                          />
                          <Label
                            htmlFor="status-maintenance"
                            className="ml-2 text-sm"
                          >
                            Maintenance
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Refill Status Filter */}
                    <div>
                      <h4 className="mb-2 font-medium text-sm">
                        Refill Status
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-full"
                            checked={filters.refill.full}
                            onCheckedChange={(checked) =>
                              toggleFilter("refill", "full", checked === true)
                            }
                          />
                          <Label htmlFor="refill-full" className="ml-2 text-sm">
                            Full
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-low"
                            checked={filters.refill.low}
                            onCheckedChange={(checked) =>
                              toggleFilter("refill", "low", checked === true)
                            }
                          />
                          <Label htmlFor="refill-low" className="ml-2 text-sm">
                            Low
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-critical"
                            checked={filters.refill.critical}
                            onCheckedChange={(checked) =>
                              toggleFilter(
                                "refill",
                                "critical",
                                checked === true,
                              )
                            }
                          />
                          <Label
                            htmlFor="refill-critical"
                            className="ml-2 text-sm"
                          >
                            Critical
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-empty"
                            checked={filters.refill.empty}
                            onCheckedChange={(checked) =>
                              toggleFilter("refill", "empty", checked === true)
                            }
                          />
                          <Label
                            htmlFor="refill-empty"
                            className="ml-2 text-sm"
                          >
                            Empty
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Last Refilled Filter */}
                    <div>
                      <h4 className="mb-2 font-medium text-sm">
                        Last Refilled
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-today"
                            checked={filters.lastRefilled === "today"}
                            onCheckedChange={(checked) =>
                              setLastRefilledFilter(checked ? "today" : null)
                            }
                          />
                          <Label
                            htmlFor="refill-today"
                            className="ml-2 text-sm"
                          >
                            Today
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-week"
                            checked={filters.lastRefilled === "week"}
                            onCheckedChange={(checked) =>
                              setLastRefilledFilter(checked ? "week" : null)
                            }
                          />
                          <Label htmlFor="refill-week" className="ml-2 text-sm">
                            In the last 7 days
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="refill-month"
                            checked={filters.lastRefilled === "month"}
                            onCheckedChange={(checked) =>
                              setLastRefilledFilter(checked ? "month" : null)
                            }
                          />
                          <Label
                            htmlFor="refill-month"
                            className="ml-2 text-sm"
                          >
                            In the last 30 days
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t p-3">
                  <div className="text-muted-foreground text-sm">
                    Showing <strong>{filteredVendos.length}</strong> of{" "}
                    <strong>{totalVendos}</strong> vendos
                  </div>
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

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

        {/* Active filters display */}
        {isFilterActive() && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(filters.status).map(
              ([key, value]) =>
                value && (
                  <Badge
                    key={`status-${key}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("status", key, false)}
                    />
                  </Badge>
                ),
            )}

            {Object.entries(filters.refill).map(
              ([key, value]) =>
                value && (
                  <Badge
                    key={`refill-${key}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("refill", key, false)}
                    />
                  </Badge>
                ),
            )}

            {filters.lastRefilled && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {filters.lastRefilled === "today"
                  ? "Refilled today"
                  : filters.lastRefilled === "week"
                    ? "Refilled in last week"
                    : "Refilled in last month"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setLastRefilledFilter(null)}
                />
              </Badge>
            )}

            {isFilterActive() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-blue-50 p-4 shadow-sm"
          >
            <h3 className="font-medium text-blue-800 text-sm">Total Vendos</h3>
            <p className="mt-2 font-bold text-2xl text-blue-900">
              {totalVendos}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-lg bg-green-50 p-4 shadow-sm"
          >
            <h3 className="font-medium text-green-800 text-sm">
              Online Vendos
            </h3>
            <p className="mt-2 font-bold text-2xl text-green-900">
              {onlineVendos}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-lg bg-red-50 p-4 shadow-sm"
          >
            <h3 className="font-medium text-red-800 text-sm">
              Critical Refill
            </h3>
            <p className="mt-2 font-bold text-2xl text-red-900">
              {criticalVendos}
            </p>
          </motion.div>
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
              {isFilterActive() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={resetFilters}
                >
                  Clear filters
                </Button>
              )}
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
