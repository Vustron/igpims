import { DataTable } from "@/components/ui/tables"

import { inspectionColumn } from "./inspection-column"
import { exampleLockerInspections } from "./data"

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
