"use client"

import { X } from "lucide-react"
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"
import { Label } from "@/components/ui/labels"

import type { RentalFilters } from "@/backend/actions/locker-rental/find-many"
import type { UserFilters } from "@/backend/actions/user/find-many"

interface DynamicFiltersPanelProps {
  filters: RentalFilters | UserFilters
  activeFiltersCount: number
  onUpdateFilters: (newFilters: Partial<RentalFilters | UserFilters>) => void
  onResetFilters: () => void
  onClose: () => void
  filterType?: "rental" | "user"
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
      </CardContent>
    </Card>
  )
}
