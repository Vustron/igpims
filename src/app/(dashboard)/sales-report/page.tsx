import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { SalesReportClient } from "@/features/sales-report/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sales Report",
}

export default async function SalesReportPage() {
  const salesReportItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Sales Report" },
  ]
  return (
    <ContentLayout title="Sales Report">
      <DynamicBreadcrumb items={salesReportItems} />
      <SalesReportClient />
    </ContentLayout>
  )
}
