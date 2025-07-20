import { Contexts } from "@/components/context"
import UserRoleProvider from "@/components/context/user-role"
import { siteConfig } from "@/config/meta-data"
import { getSession } from "@/config/session"
import { inter } from "@/fonts/inter"

import "@/styles/globals.css"

export const metadata = siteConfig.meta
export const viewport = siteConfig.viewport

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <UserRoleProvider initialRole={session.userRole || ""}>
          <Contexts>{children}</Contexts>
        </UserRoleProvider>
      </body>
    </html>
  )
}
