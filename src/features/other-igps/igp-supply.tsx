"use client"

import {
  igpSupplyColumns,
  exampleSupplyData,
} from "@/features/other-igps/igp-supply-column"
import { Card, CardContent } from "@/components/ui/cards"
import { DataTable } from "@/components/ui/tables"

export const IgpSupply = () => {
  return (
    <Card className="relative mt-6 w-auto rounded-lg border-none">
      <CardContent className="relative w-auto p-6">
        <DataTable
          columns={igpSupplyColumns}
          data={exampleSupplyData}
          placeholder="Search..."
          isLockerRental
        />
      </CardContent>
    </Card>
  )
}
