"use client"

import {
  exampleViolations,
  violationListColumns,
} from "@/features/locker/violation-list-column"

import { DataTable } from "@/components/ui/tables"

export const ViolationList = () => {
  return (
    <div className="mt-2">
      <DataTable
        columns={violationListColumns}
        data={exampleViolations}
        placeholder="Search..."
        isLockerRental
      />
    </div>
  )
}
