import { preFindManyRentals } from "@/backend/actions/locker-rental/find-many"
import { preFindManyLockers } from "@/backend/actions/locker/find-many"
import { preFindManyViolations } from "@/backend/actions/violation/find-many"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerIgpClient } from "@/features/locker-igp/client"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker Rental",
}

export default async function LockerRentalPage() {
  const [lockerResults, rentalResults, violationResults] = await Promise.all([
    preFindManyLockers(),
    preFindManyRentals(),
    preFindManyViolations(),
  ])
  const lockerRentalItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Locker Rental" },
  ]
  return (
    <QueryHydrator
      prefetchFns={[lockerResults, rentalResults, violationResults]}
    >
      <ContentLayout title="Locker Rental">
        <DynamicBreadcrumb items={lockerRentalItems} />
        <LockerIgpClient />
      </ContentLayout>
    </QueryHydrator>
  )
}
