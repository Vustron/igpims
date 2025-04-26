"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import { VerifyForm } from "@/features/auth/verify/verification-form"
import { Loader2Icon, CircleX, ShieldCheck } from "lucide-react"
import { DynamicButton } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import Link from "next/link"

import { useVerifyEmail } from "@/backend/actions/user/verify-email"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

export const COOLDOWN_TIME = 3 * 60 * 1000

const VerifyClient = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const [isVerifying, setIsVerifying] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const verifyEmail = useVerifyEmail()

  const startCooldown = useCallback(() => {
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          localStorage.removeItem("lastVerificationSent")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return timer
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined

    const lastSentTime = localStorage.getItem("lastVerificationSent")
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

  useEffect(() => {
    if (token && email && !isVerifying) {
      setIsVerifying(true)
      verifyEmail.mutate({ token, email })
    }
  }, [token, email, verifyEmail, isVerifying])

  const onVerificationSent = () => {
    localStorage.setItem("lastVerificationSent", Date.now().toString())
    setCooldownTime(COOLDOWN_TIME / 1000)
    startCooldown()
  }

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full border-[2px] border-amber-300 bg-[#2B291A] sm:w-96">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="DNSC Supreme Student Council Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-center text-lg text-white">
            {token ? "Verifying Account" : "Send Verification Link"}
          </CardTitle>
          <CardDescription className="text-center">
            {token
              ? "Please wait while we verify your account"
              : "Please check your email for a verification link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {token ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              {verifyEmail.isPending ? (
                <>
                  <Loader2Icon className="size-8 animate-spin text-black" />
                  <Label className="animate-pulse text-muted-foreground text-sm">
                    Verifying your account...
                  </Label>
                </>
              ) : verifyEmail.isError ? (
                <>
                  <CircleX className="size-8 text-red-500" />
                  <Label className="text-red-500 text-sm">
                    Failed to verify email. Please try again.
                  </Label>
                </>
              ) : verifyEmail.isSuccess ? (
                <>
                  <ShieldCheck className="size-8 text-green-500" />
                  <Label className="text-green-500 text-sm">
                    Email verified successfully!
                  </Label>
                </>
              ) : null}
            </div>
          ) : (
            <>
              {cooldownTime > 0 && (
                <div className="mb-4 flex flex-col items-center justify-center space-y-2 rounded-lg bg-muted/50 p-4">
                  <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                  <Label className="text-center text-muted-foreground text-sm">
                    Please wait {cooldownTime} seconds before requesting another
                    link
                  </Label>
                </div>
              )}
              <VerifyForm
                onSuccess={onVerificationSent}
                disabled={cooldownTime > 0}
              />
            </>
          )}
        </CardContent>

        <CardFooter>
          <div className="grid w-full gap-y-4">
            <DynamicButton
              variant="link"
              size="sm"
              asChild
              disabled={verifyEmail.isPending}
            >
              <Link href="/sign-in">
                {verifyEmail.isSuccess
                  ? "Continue to sign in"
                  : "Already verified? Sign in here"}
              </Link>
            </DynamicButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default VerifyClient
