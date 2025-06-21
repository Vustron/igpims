import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerIgpClient } from "@/features/locker-igp/client"
import { preFindManyLockers } from "@/backend/actions/locker/find-many"
import { preFindManyRentals } from "@/backend/actions/locker-rental/find-many"
import { QueryHydrator } from "@/utils/query-hydrator"

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
        <LockerIgpClient />
      </QueryHydrator>
    </ContentLayout>
  )
}
