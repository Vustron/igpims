"use client"

import {
  supplyColumns,
  exampleSupplyData,
} from "@/features/other-igps/supply-column"
import { DataTable } from "@/components/ui/tables"

export const IgpSupply = () => {
  return (
    <DataTable
      columns={supplyColumns}
      data={exampleSupplyData}
      placeholder="Search..."
    />
  )
}
