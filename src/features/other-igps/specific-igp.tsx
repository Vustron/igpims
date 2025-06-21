"use client"

import { Store } from "lucide-react"
import { useState } from "react"
import { IgpTabs } from "./igp-tabs"

interface SpecificIgpProps {
  igpTab: string
  igpTabLabel: string
  igpTabShortLabel: string
}

export const SpecificIgp = ({
  // igpTab,
  igpTabLabel,
  igpTabShortLabel,
}: SpecificIgpProps) => {
  const [activeTab, setActiveTab] = useState("igp_management")

  return (
    <IgpTabs
      igpTab="igp_management"
      igpTabLabel={igpTabLabel}
      igpTabShortLabel={igpTabShortLabel}
      igpTabIcon={<Store className="size-4" />}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  )
}
