import { preFindManyIgp } from "@/backend/actions/igp/find-many"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { OtherIgpsClient } from "@/features/other-igps/client"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Other Igps",
}

export default async function OtherIgpsPage() {
  const [igpResults] = await Promise.all([preFindManyIgp()])
  const igpItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Other IGPs" },
  ]
  return (
    <QueryHydrator prefetchFns={[igpResults]}>
      <ContentLayout title="Other Igps">
        <DynamicBreadcrumb items={igpItems} />
        <OtherIgpsClient />
      </ContentLayout>
    </QueryHydrator>
  )
}
