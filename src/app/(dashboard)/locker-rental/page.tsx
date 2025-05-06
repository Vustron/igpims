import { LockerRentalClient } from "@/features/locker-rental/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker Rental",
}

export default async function DashboardPage() {
  return (
    <ContentLayout title="Locker Rental">
      <LockerRentalClient />
    </ContentLayout>
  )
}
