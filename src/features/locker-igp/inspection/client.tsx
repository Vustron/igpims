import { DataTable } from "@/components/ui/tables"
import { exampleLockerInspections } from "./data"
import { inspectionColumn } from "./inspection-column"

export const InspectionClient = () => {
  return (
    <div className="mt-2">
      <DataTable
        columns={inspectionColumn}
        data={exampleLockerInspections}
        placeholder="Search..."
        isLockerRental
      />
    </div>
  )
}
