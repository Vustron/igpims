import { preFindManyIgp } from "@/backend/actions/igp/find-many"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { ProjectRequestClient } from "@/features/project-request/client"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Approval",
}

export default async function ProjectApprovalPage() {
  const [igpResults] = await Promise.all([preFindManyIgp()])
  const projectApprovalItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Project Approval" },
  ]
  return (
    <QueryHydrator prefetchFns={[igpResults]}>
      <ContentLayout title="Project Approval">
        <DynamicBreadcrumb items={projectApprovalItems} />
        <ProjectRequestClient />
      </ContentLayout>
    </QueryHydrator>
  )
}
