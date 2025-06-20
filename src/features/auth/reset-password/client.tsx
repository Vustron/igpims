"use client"

import { Loader2Icon } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { Label } from "@/components/ui/labels"
import { ResetPasswordForm } from "./reset-password-form"
import { SendResetLinkForm } from "./send-reset-link-form"

const COOLDOWN_TIME = 3 * 60 * 1000

export const ResetPasswordClient = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const [cooldownTime, setCooldownTime] = useState(0)

  const startCooldown = useCallback(() => {
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          localStorage.removeItem("lastResetPasswordSent")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return timer
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined

    const lastSentTime = localStorage.getItem("lastResetPasswordSent")
    if (lastSentTime) {
      const timeLeft =
        COOLDOWN_TIME - (Date.now() - Number.parseInt(lastSentTime))
      if (timeLeft > 0) {
        setCooldownTime(Math.ceil(timeLeft / 1000))
        timer = startCooldown()
      }
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [startCooldown])

  const onResetPasswordSent = () => {
    localStorage.setItem("lastResetPasswordSent", Date.now().toString())
    setCooldownTime(COOLDOWN_TIME / 1000)
    startCooldown()
  }

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full border-2 border-[#4A4520] bg-background shadow-xl sm:w-96">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="DNSC Supreme Student Council Logo"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
          </div>
          <CardTitle className="text-center text-lg">
            {token && email
              ? "Resetting Your Password"
              : "Send Reset Password Link"}
          </CardTitle>
          {/* <CardDescription className="text-center">
            {token && email
              ? "Please wait while we reset the password of your account"
              : "Please check your email for a reset password link."}
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          {token && email ? (
            <ResetPasswordForm token={token} email={email} />
          ) : (
            <>
              {cooldownTime > 0 && (
                <div className="mb-4 flex flex-col items-center justify-center space-y-2 rounded-lg bg-muted/50 p-4">
                  <Loader2Icon className="size-6 animate-spin" />
                  <Label className="text-center text-sm">
                    Please wait {cooldownTime} seconds before requesting another
                    link
                  </Label>
                </div>
              )}
              <SendResetLinkForm
                onSuccess={onResetPasswordSent}
                disabled={cooldownTime > 0}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
