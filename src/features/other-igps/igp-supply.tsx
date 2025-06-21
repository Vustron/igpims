"use client"

import { Card, CardContent } from "@/components/ui/cards"
import { DataTable } from "@/components/ui/tables"
import { exampleSupplyData, igpSupplyColumns } from "./igp-supply-column"

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
