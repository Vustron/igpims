import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ProjectRequestClient } from "@/features/project-request/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Approval",
}

export default async function ProjectApprovalPage() {
  const projectApprovalItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Project Approval" },
  ]
  return (
    <ContentLayout title="Project Approval">
      <DynamicBreadcrumb items={projectApprovalItems} />
      <ProjectRequestClient />
    </ContentLayout>
  )
}
