import ResetPasswordClient from "@/features/reset-password/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
}

export default async function VerifyPage() {
  return (
    <div className="m-auto flex size-full flex-col items-center justify-center space-y-12">
      <ResetPasswordClient />
    </div>
  )
}
