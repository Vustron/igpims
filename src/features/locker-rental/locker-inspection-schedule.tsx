import {
  violationListColumns,
  exampleLockerViolations,
} from "@/features/locker-rental/violation-list-column"
import { DataTable } from "@/components/ui/tables"

export const LockerInspectionSchedule = () => {
  return (
    <div className="mt-2">
      <DataTable
        columns={violationListColumns}
        data={exampleLockerViolations}
        placeholder="Search..."
        isLockerRental
      />
    </div>
  )
}
