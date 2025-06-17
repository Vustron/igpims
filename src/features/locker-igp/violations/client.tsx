"use client"

import { DataTable } from "@/components/ui/tables"

import { violationListColumns } from "./violation-list-column"
import { exampleViolations } from "./data"

export const ViolationClient = () => {
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
