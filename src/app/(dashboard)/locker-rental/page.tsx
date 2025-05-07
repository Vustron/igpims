import { LockerRentalTabs } from "@/features/locker-rental/locker-tabs"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker Rental",
}

export default async function DashboardPage() {
  return (
    <ContentLayout title="Locker Rental">
      <LockerRentalTabs />
    </ContentLayout>
  )
}
