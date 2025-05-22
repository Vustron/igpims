import { NotificationClient } from "@/features/notification/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notification",
}

export default async function NotificationPage() {
  return (
    <ContentLayout title="Notification">
      <NotificationClient />
    </ContentLayout>
  )
}
