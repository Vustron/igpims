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

interface DynamicFiltersPanelProps {
  filters: RentalFilters
  activeFiltersCount: number
  onUpdateFilters: (newFilters: Partial<RentalFilters>) => void
  onResetFilters: () => void
  onClose: () => void
}

export const DynamicFiltersPanel = ({
  filters,
  activeFiltersCount,
  onUpdateFilters,
  onResetFilters,
  onClose,
}: DynamicFiltersPanelProps) => {
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
        <div className="space-y-2">
          <Label className="font-medium text-sm">Rental Status</Label>
          <Select
            value={filters.rentalStatus || "all"}
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
            value={filters.paymentStatus || "all"}
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
            value={filters.renterName || ""}
            onChange={(e) =>
              onUpdateFilters({ renterName: e.target.value || undefined })
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-sm">Course & Section</Label>
          <Input
            placeholder="Filter by course..."
            value={filters.courseAndSet || ""}
            onChange={(e) =>
              onUpdateFilters({ courseAndSet: e.target.value || undefined })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
