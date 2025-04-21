import { Contexts } from "@/components/context"

import { siteConfig } from "@/config/meta-data"

import { inter } from "@/fonts/inter"

import "@/styles/globals.css"

export const metadata = siteConfig.meta
export const viewport = siteConfig.viewport

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Contexts>{children}</Contexts>
      </body>
    </html>
  )
}
