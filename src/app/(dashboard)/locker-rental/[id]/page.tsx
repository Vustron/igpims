import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerClient } from "@/features/locker/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LockerIdPage({ params }: PageProps) {
  const [resolvedParams] = await Promise.all([params])
  const { id } = resolvedParams
  return (
    <ContentLayout title="Locker">
      <LockerClient id={id} />
    </ContentLayout>
  )
}
