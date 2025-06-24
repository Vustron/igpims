"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { Input } from "@/components/ui/inputs"
import { Label } from "@/components/ui/labels"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { InspectionFilters } from "@/backend/actions/inspection/find-many"
import { RentalFilters } from "@/backend/actions/locker-rental/find-many"
import { UserFilters } from "@/backend/actions/user/find-many"
import { ViolationFilters } from "@/backend/actions/violation/find-many"

interface DynamicFiltersPanelProps {
  filters: RentalFilters | UserFilters | ViolationFilters | InspectionFilters
  activeFiltersCount: number
  onUpdateFilters: (
    newFilters: Partial<
      RentalFilters | UserFilters | ViolationFilters | InspectionFilters
    >,
  ) => void
  onResetFilters: () => void
  onClose: () => void
  filterType?: "rental" | "user" | "violations" | "inspection"
}

export const DynamicFiltersPanel = ({
  filters,
  activeFiltersCount,
  onUpdateFilters,
  onResetFilters,
  onClose,
  filterType = "rental",
}: DynamicFiltersPanelProps) => {
  const isRentalFilter = filterType === "rental"
  const isUserFilter = filterType === "user"
  const isViolationsFilter = filterType === "violations"
  const isInspectionFilter = filterType === "inspection"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onResetFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Rental Filters */}
        {isRentalFilter && (
          <>
            <div className="space-y-2">
              <Label className="font-medium text-sm">Rental Status</Label>
              <Select
                value={(filters as RentalFilters).rentalStatus || "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    rentalStatus:
                      value === "all"
                        ? undefined
                        : (value as RentalFilters["rentalStatus"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All statuses
                  </SelectItem>
                  <SelectItem key="active" value="active">
                    Active
                  </SelectItem>
                  <SelectItem key="pending" value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem key="expired" value="expired">
                    Expired
                  </SelectItem>
                  <SelectItem key="cancelled" value="cancelled">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Payment Status</Label>
              <Select
                value={(filters as RentalFilters).paymentStatus || "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    paymentStatus:
                      value === "all"
                        ? undefined
                        : (value as RentalFilters["paymentStatus"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all-payment" value="all">
                    All payments
                  </SelectItem>
                  <SelectItem key="paid" value="paid">
                    Paid
                  </SelectItem>
                  <SelectItem key="pending-payment" value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem key="partial" value="partial">
                    Partial
                  </SelectItem>
                  <SelectItem key="overdue" value="overdue">
                    Overdue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Renter Name</Label>
              <Input
                placeholder="Filter by name..."
                value={(filters as RentalFilters).renterName || ""}
                onChange={(e) =>
                  onUpdateFilters({ renterName: e.target.value || undefined })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Course & Section</Label>
              <Input
                placeholder="Filter by course..."
                value={(filters as RentalFilters).courseAndSet || ""}
                onChange={(e) =>
                  onUpdateFilters({ courseAndSet: e.target.value || undefined })
                }
              />
            </div>
          </>
        )}

        {/* User Filters */}
        {isUserFilter && (
          <div className="space-y-2">
            <Label className="font-medium text-sm">Role</Label>
            <Select
              value={(filters as UserFilters).role || "all"}
              onValueChange={(value) =>
                onUpdateFilters({
                  role:
                    value === "all" ? undefined : (value as "admin" | "user"),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  All roles
                </SelectItem>
                <SelectItem key="admin" value="admin">
                  Admin
                </SelectItem>
                <SelectItem key="user" value="user">
                  User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Violation Filters */}
        {isViolationsFilter && (
          <>
            <div className="space-y-2">
              <Label className="font-medium text-sm">Violation Type</Label>
              <Select
                value={(filters as ViolationFilters).violationType || "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    violationType:
                      value === "all"
                        ? undefined
                        : (value as ViolationFilters["violationType"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All types
                  </SelectItem>
                  <SelectItem key="lost_key" value="lost_key">
                    Lost Key
                  </SelectItem>
                  <SelectItem key="damaged_locker" value="damaged_locker">
                    Damaged Locker
                  </SelectItem>
                  <SelectItem key="unauthorized_use" value="unauthorized_use">
                    Unauthorized Use
                  </SelectItem>
                  <SelectItem key="prohibited_items" value="prohibited_items">
                    Prohibited Items
                  </SelectItem>
                  <SelectItem key="late_renewal" value="late_renewal">
                    Late Renewal
                  </SelectItem>
                  <SelectItem key="abandoned_items" value="abandoned_items">
                    Abandoned Items
                  </SelectItem>
                  <SelectItem key="other" value="other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Fine Status</Label>
              <Select
                value={(filters as ViolationFilters).fineStatus || "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    fineStatus:
                      value === "all"
                        ? undefined
                        : (value as ViolationFilters["fineStatus"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All statuses
                  </SelectItem>
                  <SelectItem key="paid" value="paid">
                    Paid
                  </SelectItem>
                  <SelectItem key="unpaid" value="unpaid">
                    Unpaid
                  </SelectItem>
                  <SelectItem key="partial" value="partial">
                    Partial
                  </SelectItem>
                  <SelectItem key="waived" value="waived">
                    Waived
                  </SelectItem>
                  <SelectItem key="under_review" value="under_review">
                    Under Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Student Name/ID</Label>
              <Input
                placeholder="Filter by student..."
                value={(filters as ViolationFilters).search || ""}
                onChange={(e) =>
                  onUpdateFilters({ search: e.target.value || undefined })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={
                    (filters as ViolationFilters).fromDate
                      ? new Date((filters as ViolationFilters).fromDate!)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onUpdateFilters({
                      fromDate: e.target.value
                        ? new Date(e.target.value).getTime()
                        : undefined,
                    })
                  }
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={
                    (filters as ViolationFilters).toDate
                      ? new Date((filters as ViolationFilters).toDate!)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onUpdateFilters({
                      toDate: e.target.value
                        ? new Date(e.target.value).getTime()
                        : undefined,
                    })
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Added Inspection Filters */}
        {isInspectionFilter && (
          <>
            <div className="space-y-2">
              <Label className="font-medium text-sm">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={
                    (filters as InspectionFilters).startDate
                      ? new Date((filters as InspectionFilters).startDate!)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onUpdateFilters({
                      startDate: e.target.value || undefined,
                    })
                  }
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={
                    (filters as InspectionFilters).endDate
                      ? new Date((filters as InspectionFilters).endDate!)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onUpdateFilters({
                      endDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Sort By</Label>
              <Select
                value={(filters as InspectionFilters).sort || "latest"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    sort: value as
                      | "latest"
                      | "oldest"
                      | "highestFines"
                      | "lowestFines",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highestFines">Highest Fines</SelectItem>
                  <SelectItem value="lowestFines">Lowest Fines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">Violator Search</Label>
              <Input
                placeholder="Search by violator name..."
                value={(filters as InspectionFilters).search || ""}
                onChange={(e) =>
                  onUpdateFilters({
                    search: e.target.value || undefined,
                  })
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
