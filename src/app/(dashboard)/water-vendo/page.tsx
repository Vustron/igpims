import { WaterVendoTabs } from "@/features/water-vendo/water-vendo-tabs"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Water Vendo",
}

export default async function WaterVendoPage() {
  return (
    <ContentLayout title="Water Vendo">
      <WaterVendoTabs />
    </ContentLayout>
  )
}
