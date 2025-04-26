import { getBaseUrl } from "@/utils/get-base-url"

import type { Metadata, Viewport } from "next"

export type SiteConfig = {
  meta: Metadata
  viewport: Viewport
}

// site config
export const siteConfig: SiteConfig = {
  meta: {
    metadataBase: new URL(getBaseUrl()),
    title: {
      template: "%s | IGPMIS",
      default: "IGPMIS",
    },
    applicationName: "IGPMIS",
    description: "A template made by Vustron",
    openGraph: { images: ["/og"] },
    icons: [{ rel: "icon", url: "/images/logo.png" }],
  },
  viewport: {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "hsl(0 0% 100%)" },
      { media: "(prefers-color-scheme: dark)", color: "hsl(240 10% 3.9%)" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
  },
}
