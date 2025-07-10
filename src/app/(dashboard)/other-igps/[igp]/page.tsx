import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { SpecificIgp } from "@/features/other-igps/specific-igp"
import { Metadata } from "next"

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

  const igpItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Other IGPs", href: "/other-igps" },
    { label: `${displayName}`, href: `/other-igps/${displayName}` },
  ]

  return (
    <ContentLayout title={displayName}>
      <DynamicBreadcrumb items={igpItems} />
      <SpecificIgp
        igpTab={displayName}
        igpTabLabel={displayName}
        igpTabShortLabel={displayName}
      />
    </ContentLayout>
  )
}
