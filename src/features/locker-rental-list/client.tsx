"use client"

import { lockerRentalListColumns } from "@/features/locker-rental-list/locker-rental-list-columns"
import { lockerRentalListExample } from "@/features/locker-rental-list/example_list"
import { Card, CardContent } from "@/components/ui/cards"
import { DataTable } from "@/components/ui/tables"

export const LockerRentalListClient = () => {
  return (
    <Card className="relative mt-6 w-auto rounded-lg border-none">
      <CardContent className="relative w-auto p-6">
        <DataTable
          columns={lockerRentalListColumns}
          data={lockerRentalListExample}
          placeholder="Search..."
        />
      </CardContent>
    </Card>
  )
}
