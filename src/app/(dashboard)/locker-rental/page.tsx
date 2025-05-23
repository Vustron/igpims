import { LockerRentalTabs } from "@/features/locker-rental/locker-rental-tabs"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

import { QueryHydrator } from "@/utils/query-hydrator"
import { preFindManyLockers } from "@/backend/actions/locker/find-many"

export const metadata: Metadata = {
  title: "Locker Rental",
}

export default async function LockerRentalPage() {
  const [lockerResults] = await Promise.all([preFindManyLockers()])
  return (
    <ContentLayout title="Locker Rental">
      <QueryHydrator prefetchFns={[lockerResults]}>
        <LockerRentalTabs />
      </QueryHydrator>
    </ContentLayout>
  )
}
