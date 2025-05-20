import { ContentLayout } from "@/features/layouts/content-layout"
import { SpecificIgp } from "@/features/other-igps/specific-igp"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IGP",
}

interface PageProps {
  params: Promise<{ igp: string }>
}

export default async function IgpPage({ params }: PageProps) {
  const [resolvedParams] = await Promise.all([params])
  const { igp } = resolvedParams

  const formatIgpName = (name: string): string => {
    return name
      .split("%20")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const displayName = formatIgpName(igp)

  return (
    <ContentLayout title={displayName}>
      <SpecificIgp
        igpTab={displayName}
        igpTabLabel={displayName}
        igpTabShortLabel={displayName}
      />
    </ContentLayout>
  )
}
