"use client"

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormControlRenderer,
} from "@/components/ui/forms"
import { Loader2Icon, ChevronDown, ChevronUp } from "lucide-react"
import { Button, DynamicButton } from "@/components/ui/buttons"
import { Switch } from "@/components/ui/inputs"
import Image from "next/image"

import { useGenerate2FA } from "@/backend/actions/user/generate-2fa"
import { useOtpStore } from "@/hooks/use-otp-store"
import { useRouter } from "next-nprogress-bar"
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
  sections,
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
  isFloatingLabelInput,
  addCancelButton,
  twoColumnLayout = false,
}: DynamicFormProps<TFieldValues>) => {
  const [isPasswordStrong, setIsPasswordStrong] = useState(true)
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    form.getValues("otpSignIn" as Path<TFieldValues>) || false,
  )
  const [qrCode, setQrCode] = useState<string>()
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    if (sections) {
      const initialState: Record<string, boolean> = {}
      sections.forEach((section) => {
        initialState[section.id] = section.defaultExpanded ?? true
      })
      setExpandedSections(initialState)
    }
  }, [sections])

  const generate2FA = useGenerate2FA()
  const resetOtpSignIn = useOtpStore((state) => state.resetOtpSignIn)
  const router = useRouter()

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const renderFormFields = () => {
    if (sections && sections.length > 0) {
      return (
        <>
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                "rounded-lg border border-border",
                section.className,
              )}
            >
              <Button
                className={cn(
                  "flex cursor-pointer items-center justify-between px-4 py-3",
                  section.titleClassName,
                )}
                onClick={() => toggleSection(section.id)}
              >
                <div>
                  <h3 className="font-medium text-lg">{section.title}</h3>
                  {section.description && (
                    <p className="text-muted-foreground text-sm">
                      {section.description}
                    </p>
                  )}
                </div>
                <div className="text-muted-foreground">
                  {expandedSections[section.id] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections[section.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("px-4 pb-4", section.contentClassName)}
                  >
                    <div
                      className={cn(
                        "grid gap-5",
                        twoColumnLayout && "grid-cols-1 md:grid-cols-2",
                      )}
                    >
                      {fields
                        .filter((field) => field.section === section.id)
                        .map((field) => (
                          <FormField
                            key={field.name.toString()}
                            name={field.name}
                            control={form.control}
                            render={({ field: formField }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <FormControlRenderer
                                    field={field}
                                    formField={formField}
                                    form={form}
                                    mutation={mutation!}
                                    disabled={disabled!}
                                    isSignUp={isSignUp}
                                    onPasswordStrengthChange={
                                      setIsPasswordStrong
                                    }
                                    isFloatingLabel={isFloatingLabelInput}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Render fields without a section */}
          <div
            className={cn(
              "grid gap-5",
              twoColumnLayout && "grid-cols-1 md:grid-cols-2",
            )}
          >
            {fields
              .filter((field) => !field.section)
              .map((field) => (
                <FormField
                  key={field.name.toString()}
                  name={field.name}
                  control={form.control}
                  render={({ field: formField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <FormControlRenderer
                          field={field}
                          formField={formField}
                          form={form}
                          mutation={mutation!}
                          disabled={disabled!}
                          isSignUp={isSignUp}
                          onPasswordStrengthChange={setIsPasswordStrong}
                          isFloatingLabel={isFloatingLabelInput}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
          </div>
        </>
      )
    }

    // If no sections are provided, render all fields in a traditional layout
    return (
      <div
        className={cn(
          "grid gap-5",
          twoColumnLayout && "grid-cols-1 md:grid-cols-2",
        )}
      >
        {fields.map((field) => (
          <FormField
            key={field.name.toString()}
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <FormControlRenderer
                    field={field}
                    formField={formField}
                    form={form}
                    mutation={mutation!}
                    disabled={disabled!}
                    isSignUp={isSignUp}
                    onPasswordStrengthChange={setIsPasswordStrong}
                    isFloatingLabel={isFloatingLabelInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("w-full space-y-6", className)}
      >
        {renderFormFields()}

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
            <DynamicButton variant="link" size="sm" asChild>
              <Link
                href={isResetPassword ? "/sign-in" : "/reset-password"}
                onClick={resetOtpSignIn}
              >
                <span className="text-sm hover:text-amber-300">
                  {isResetPassword
                    ? "Continue to sign in?"
                    : "Forgot password?"}
                </span>
              </Link>
            </DynamicButton>
            {!isResetPassword && (
              <DynamicButton variant="link" size="sm" asChild>
                <Link href={"/sign-up"} onClick={resetOtpSignIn}>
                  <span className="text-sm hover:text-amber-300">
                    Don't have an account?
                  </span>
                </Link>
              </DynamicButton>
            )}
          </div>
        )}

        <div
          className={cn(
            addCancelButton
              ? "flex flex-col items-center gap-3 sm:flex-row"
              : "flex justify-end",
          )}
        >
          {addCancelButton && (
            <DynamicButton
              type="button"
              title="Cancel"
              disabled={mutation?.isPending || disabled}
              buttonClassName={cn(
                "w-full !bg-red-500 !hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400",
                submitButtonClassname,
              )}
              titleClassName={submitButtonTitleClassname}
              onClick={() => router.back()}
            />
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
        </div>
      </form>
    </Form>
  )
}
