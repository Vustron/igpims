import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { useDialog } from "@/hooks/use-dialog"
import { Printer } from "lucide-react"

// interface SalesReportHeaderProps {
//   onPrint: () => void
// }

export const SalesReportHeader = () => {
  const { onOpen } = useDialog()

  const handlePrintSelection = (value: string) => {
    switch (value) {
      case "profit-loss":
        console.log("Printing Profit & Loss Report")
        onOpen("printProfitLoss")
        break
      case "financial-report":
        console.log("Printing Financial Report for each IGP")
        onOpen("printIgpFinancialReport")
        break
      case "due-overdue":
        console.log("Printing List of Students for due & overdue payments")
        onOpen("printDueOverduePayments")
        break
      case "igp-status":
        console.log("Printing List of IGP statuses")
        onOpen("printIgpStatus")
        break
      default:
        break
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground text-sm">
          Comprehensive sales data analysis for Income Generating Projects
        </p>
      </div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Select onValueChange={handlePrintSelection}>
          <SelectTrigger className="h-8 w-auto">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <SelectValue placeholder="Print Reports" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profit-loss">Profit & Loss Report</SelectItem>
            <SelectItem value="financial-report">
              Financial Report (Each IGP)
            </SelectItem>
            <SelectItem value="due-overdue">Due & Overdue Payments</SelectItem>
            <SelectItem value="igp-status">IGP Statuses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
