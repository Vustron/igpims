import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { LockerRentalTabs } from "@/features/locker-rental/locker-rental-tabs"
import { ContentLayout } from "@/features/layouts/content-layout"

import { preFindManyRentals } from "@/backend/actions/locker-rental/find-many"
import { preFindManyLockers } from "@/backend/actions/locker/find-many"
import { QueryHydrator } from "@/utils/query-hydrator"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker Rental",
}

export default async function LockerRentalPage() {
  const [lockerResults, rentalResults] = await Promise.all([
    preFindManyLockers(),
    preFindManyRentals(),
  ])
  const lockerRentalItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Locker Rental" },
  ]
  return (
    <ContentLayout title="Locker Rental">
      <DynamicBreadcrumb items={lockerRentalItems} />
      <QueryHydrator prefetchFns={[lockerResults, rentalResults]}>
        <LockerRentalTabs />
      </QueryHydrator>
    </ContentLayout>
  )
}
