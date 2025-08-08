import { preFindManyActivity } from "@/backend/actions/activity/find-many"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ActivityLogClient } from "@/features/actvitity/client"
import { ContentLayout } from "@/features/layouts/content-layout"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Activity Log",
}

export default async function ActivityPage() {
  const [preFindManyActivities] = await Promise.all([preFindManyActivity()])
  const activityItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Activity Log", href: "/activity" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindManyActivities]}>
      <ContentLayout title="Activity Log">
        <DynamicBreadcrumb items={activityItems} />
        <ActivityLogClient />
      </ContentLayout>
    </QueryHydrator>
  )
}
