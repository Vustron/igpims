import { Metadata } from "next"
import VerifyClient from "@/features/auth/verify/client"

export const metadata: Metadata = {
  title: "Verify",
}

export default async function VerifyPage() {
  return (
    <div className="relative grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="size-full" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <VerifyClient />
      </div>
    </div>
  )
}
