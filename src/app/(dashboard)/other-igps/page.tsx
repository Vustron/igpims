import { ContentLayout } from "@/features/layouts/content-layout"
import { OtherIgpsClient } from "@/features/other-igps/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Other Igps",
}

export default async function OtherIgpsPage() {
  return (
    <ContentLayout title="Other Igps">
      <OtherIgpsClient />
    </ContentLayout>
  )
}
