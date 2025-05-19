import {
  violationListColumns,
  exampleLockerViolations,
} from "@/features/locker-inspection/violation-list-column"
import { DataTable } from "@/components/ui/tables"

export const LockerInspectionSchedule = () => {
  return (
    <DataTable
      columns={violationListColumns}
      data={exampleLockerViolations}
      placeholder="Search..."
    />
  )
}
