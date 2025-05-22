import { Download, Plus, Printer } from "lucide-react"
import { Button } from "@/components/ui/buttons"

interface SalesReportHeaderProps {
  onPrint: () => void
  onExport: () => void
}

export const SalesReportHeader = ({
  onPrint,
  onExport,
}: SalesReportHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">IGP Sales Report</h1>
        <p className="text-muted-foreground text-sm">
          Comprehensive sales data analysis for Income Generating Projects
        </p>
      </div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" size="sm" className="gap-1" onClick={onPrint}>
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Sale</span>
        </Button>
      </div>
    </div>
  )
}
