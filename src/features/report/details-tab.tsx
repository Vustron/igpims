import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/cards"
import { salesReportColumn } from "@/features/report/sales-report-column"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { DataTable } from "@/components/ui/tables"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"

import type { SalesData } from "@/features/report/sales-report-types"

interface SalesDetailsTabProps {
  filteredSalesData: SalesData[]
  salesData: SalesData[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  formatCurrency: (amount: number) => string
}

export const SalesDetailsTab = ({
  filteredSalesData,
  salesData,
  searchTerm,
  onSearchTermChange,
  formatCurrency,
}: SalesDetailsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>
            Detailed list of all sales transactions
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSearchTermChange("")}
                className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <DataTable
              columns={salesReportColumn()}
              data={filteredSalesData}
              placeholder="No sales found"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{filteredSalesData.length}</span> of{" "}
              <span className="font-medium">{salesData.length}</span>{" "}
              transactions
            </p>
            <p className="text-muted-foreground">
              Total amount:{" "}
              <span className="font-medium">
                {formatCurrency(
                  filteredSalesData.reduce(
                    (sum, sale) => sum + sale.totalAmount,
                    0,
                  ),
                )}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
