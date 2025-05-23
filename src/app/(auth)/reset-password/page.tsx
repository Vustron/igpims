import { ResetPasswordClient } from "@/features/auth/reset-password/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
}

export default async function VerifyPage() {
  return (
    <div className="relative grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="size-full" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <ResetPasswordClient />
      </div>
    </div>
  )
}
