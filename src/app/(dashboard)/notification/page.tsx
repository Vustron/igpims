import { Metadata } from "next"
import { ContentLayout } from "@/features/layouts/content-layout"
import { NotificationClient } from "@/features/notification/client"

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
