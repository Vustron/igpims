import { ContentLayout } from "@/features/layouts/content-layout"
import { DashboardClient } from "@/features/dashboard/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardClient />
    </ContentLayout>
  )
}
