"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import { SignInOtpAuthenticatorForm } from "@/features/sign-in/otp-auth-signin-form"
import { SignInOTPEmailForm } from "@/features/sign-in/otp-email-signin-form"
import { SignInEmailForm } from "@/features/sign-in/email-signin-form"

import { useOtpStore } from "@/hooks/use-otp-store"

interface SignInClientProps {
  userId?: string
}

const SignInClient = ({ userId }: SignInClientProps) => {
  const isOtpSignIn = useOtpStore((state) => state.isOtpSignIn)

  const renderForm = () => {
    if (userId && isOtpSignIn) {
      return <SignInOtpAuthenticatorForm userId={userId} />
    }
    return isOtpSignIn ? <SignInOTPEmailForm /> : <SignInEmailForm />
  }

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>
            {userId && isOtpSignIn
              ? "Enter Authenticator Code"
              : !isOtpSignIn
                ? "Sign in"
                : "OTP Sign in"}
          </CardTitle>
          <CardDescription>
            {userId && isOtpSignIn
              ? "Enter the code from your authenticator app"
              : !isOtpSignIn
                ? "Welcome back! Please sign in to continue"
                : "Enter the OTP from your authenticator app"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderForm()}</CardContent>
      </Card>
    </div>
  )
}

export default SignInClient
