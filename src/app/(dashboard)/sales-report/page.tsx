import { SalesReportClient } from "@/features/sales-report/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sales Report",
}

export default async function SalesReportPage() {
  return (
    <ContentLayout title="Sales Report">
      <SalesReportClient />
    </ContentLayout>
  )
}
