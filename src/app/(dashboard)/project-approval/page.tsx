import { ProjectRequestClient } from "@/features/project-request/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Approval",
}

export default async function FundRequestPage() {
  return (
    <ContentLayout title="Project Approval">
      <ProjectRequestClient />
    </ContentLayout>
  )
}
