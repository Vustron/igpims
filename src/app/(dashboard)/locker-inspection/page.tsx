import { LockerInspectionClient } from "@/features/locker-inspection/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker Inspection",
}

export default async function LockerInspectionPage() {
  return (
    <ContentLayout title="Locker Inspection">
      <LockerInspectionClient />
    </ContentLayout>
  )
}
