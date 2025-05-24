import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { OtherIgpsClient } from "@/features/other-igps/client"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Other Igps",
}

export default async function OtherIgpsPage() {
  const igpItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Other IGPs" },
  ]
  return (
    <ContentLayout title="Other Igps">
      <DynamicBreadcrumb items={igpItems} />
      <OtherIgpsClient />
    </ContentLayout>
  )
}
