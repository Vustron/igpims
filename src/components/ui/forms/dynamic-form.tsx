"use client"

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormControlRenderer,
} from "@/components/ui/forms"
import { DynamicButton } from "@/components/ui/buttons"
import { Switch } from "@/components/ui/inputs"
import { Loader2Icon } from "lucide-react"
import Image from "next/image"

import { useGenerate2FA } from "@/backend/actions/user/generate-2fa"
import { useOtpStore } from "@/hooks/use-otp-store"
import { useEffect, useState } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import Link from "next/link"

import type { FieldValues, Path, PathValue } from "react-hook-form"
import type { DynamicFormProps } from "@/interfaces/form"

export const DynamicForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitButtonTitle,
  mutation,
  className,
  disabled,
  submitButtonClassname,
  submitButtonTitleClassname,
  isSignUp,
  isSignIn,
  isResetPassword,
  isOnEditAccount,
}: DynamicFormProps<TFieldValues>) => {
  const [isPasswordStrong, setIsPasswordStrong] = useState(true)
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    form.getValues("otpSignIn" as Path<TFieldValues>) || false,
  )
  const [qrCode, setQrCode] = useState<string>()
  const generate2FA = useGenerate2FA()
  const resetOtpSignIn = useOtpStore((state) => state.resetOtpSignIn)

  useEffect(() => {
    if (isTwoFactorEnabled) {
      generate2FA.mutate(undefined, {
        onSuccess: (data) => {
          setQrCode(data)
          form.setValue(
            "otpSignIn" as Path<TFieldValues>,
            true as PathValue<TFieldValues, Path<TFieldValues>>,
          )
        },
      })
    } else {
      setQrCode(undefined)
      form.setValue(
        "otpSignIn" as Path<TFieldValues>,
        false as PathValue<TFieldValues, Path<TFieldValues>>,
      )
    }
  }, [isTwoFactorEnabled, form])

  const handleSubmit = async (values: TFieldValues) => {
    if (!isPasswordStrong && isSignUp) return
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("w-full space-y-5", className)}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormControl>
                  <FormControlRenderer
                    field={field}
                    formField={formField}
                    form={form}
                    mutation={mutation!}
                    disabled={disabled!}
                    isSignUp={isSignUp}
                    onPasswordStrengthChange={setIsPasswordStrong}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {isOnEditAccount && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <label
                  htmlFor="two-factor-auth"
                  className="font-medium text-sm"
                >
                  Two Factor Auth
                </label>
                <p className="text-muted-foreground text-sm">
                  Enable two factor authentication for enhanced security
                </p>
              </div>
              <Switch
                checked={isTwoFactorEnabled}
                onCheckedChange={(checked: boolean) => {
                  setIsTwoFactorEnabled(checked)
                  form.setValue(
                    "otpSignIn" as Path<TFieldValues>,
                    checked as PathValue<TFieldValues, Path<TFieldValues>>,
                  )
                }}
                className="ml-5"
                aria-label="Toggle two factor authentication"
              />
            </motion.div>

            <AnimatePresence>
              {generate2FA.isPending && (
                <div className="flex justify-center">
                  <Loader2Icon className="size-6 animate-spin" />
                </div>
              )}
              {isTwoFactorEnabled && qrCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-lg border p-4"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="mb-4 text-muted-foreground text-sm">
                      Scan this QR code with your authenticator app:
                    </p>
                    <div className="flex justify-center">
                      <Image
                        src={qrCode}
                        alt="2FA QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-4 text-muted-foreground text-xs">
                      After scanning, enter the code from your authenticator app
                      to verify setup
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        {(isSignIn || isResetPassword) && (
          <div className="flex items-center justify-between">
            <DynamicButton
              variant="link"
              size="sm"
              asChild
              onClick={resetOtpSignIn}
            >
              <Link href="/sign-up">
                <span className="text-muted-foreground text-sm">
                  Don't have an account?
                </span>
              </Link>
            </DynamicButton>

            <DynamicButton variant="link" size="sm" asChild>
              <Link
                href={isResetPassword ? "/sign-in" : "/reset-password"}
                onClick={resetOtpSignIn}
              >
                <span className="text-muted-foreground text-sm">
                  {isResetPassword
                    ? "Continue to sign in?"
                    : "Forgot password?"}
                </span>
              </Link>
            </DynamicButton>
          </div>
        )}
        <DynamicButton
          type="submit"
          title={submitButtonTitle}
          disabled={mutation?.isPending || disabled}
          buttonClassName={cn(
            "w-full focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600",
            submitButtonClassname,
          )}
          titleClassName={submitButtonTitleClassname}
        />
      </form>
    </Form>
  )
}
