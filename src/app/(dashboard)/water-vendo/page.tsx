import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { WaterVendoTabs } from "@/features/water-vendo/water-vendo-tabs"

export const metadata: Metadata = {
  title: "Water Vendo",
}

export default async function WaterVendoPage() {
  const waterVendoItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Water Vendo", href: "/water-vendo" },
  ]
  return (
    <ContentLayout title="Water Vendo">
      <DynamicBreadcrumb items={waterVendoItems} />
      <WaterVendoTabs />
    </ContentLayout>
  )
}
