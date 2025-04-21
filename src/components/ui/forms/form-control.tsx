import {
  Switch,
  InputOTP,
  FileUpload,
  InputOTPSlot,
  InputOTPGroup,
  FloatingLabelInput,
  FloatingLabelTextArea,
} from "@/components/ui/inputs"
import { PasswordStrengthMeter } from "@/components/ui/forms"
import { FloatingSelect } from "@/components/ui/selects"

import { cn } from "@/utils/cn"

import { useOtpStore } from "@/hooks/use-otp-store"

import type { FieldValues, UseFormReturn } from "react-hook-form"
import type { FieldConfig, Mutation } from "@/interfaces/form"

interface FormControlRendererProps<TFieldValues extends FieldValues> {
  field: FieldConfig<TFieldValues>
  formField: any
  form: UseFormReturn<TFieldValues>
  mutation: Mutation
  disabled: boolean
  isSignUp?: boolean
  onPasswordStrengthChange?: (isStrong: boolean) => void
}

export const FormControlRenderer = <TFieldValues extends FieldValues>({
  field,
  formField,
  form,
  mutation,
  disabled,
  isSignUp,
  onPasswordStrengthChange,
}: FormControlRendererProps<TFieldValues>) => {
  const isOtpSignIn = useOtpStore((state) => state.isOtpSignIn)

  switch (field.type) {
    case "select":
      return (
        <FloatingSelect
          options={field.options || []}
          label={field.label}
          placeholder={field.placeholder}
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          value={formField.value}
          disabled={mutation?.isPending || disabled}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "textarea":
      return (
        <FloatingLabelTextArea
          {...formField}
          id={field.name}
          label={field.label}
          placeholder={field.placeholder}
          disabled={mutation?.isPending || disabled}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={formField.value}
            onCheckedChange={(checked) => {
              formField.onChange(checked)
            }}
            disabled={mutation?.isPending || disabled}
          />
          <label
            htmlFor={field.name}
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {formField.value}
          </label>
        </div>
      )

    case "file":
    case "image":
      return (
        <FileUpload
          onChange={(files) => formField.onChange(files[0])}
          value={formField.value}
          label={field.label}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "text":
    case "password":
    case "email":
    case "number":
      if (field.type === "password" && !isSignUp && isOtpSignIn) {
        return (
          <InputOTP
            maxLength={6}
            value={formField.value || ""}
            onChange={(value) => formField.onChange(value)}
            disabled={mutation?.isPending}
            containerClassName="w-full ml-10"
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, idx) => (
                  <InputOTPSlot
                    key={idx}
                    {...slot}
                    className={cn(
                      form.formState.errors[field.name]
                        ? "border-red-600 focus:ring-0"
                        : "",
                      field.className,
                    )}
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        )
      }

      return (
        <>
          {!isOtpSignIn && (
            <>
              <FloatingLabelInput
                {...formField}
                id={field.name}
                type={field.type}
                label={field.label}
                placeholder={isOtpSignIn ? field.placeholder : null}
                disabled={mutation?.isPending}
                hasErrors={!!form.formState.errors[field.name]}
                className={cn(
                  form.formState.errors[field.name]
                    ? "border-red-600 focus:ring-0"
                    : "space-y-10",
                  field.className,
                )}
                isPassword={field.type === "password"}
              />

              {((isSignUp && field.type === "password") ||
                (field.type === "password" &&
                  field.name === "newPassword")) && (
                <PasswordStrengthMeter
                  password={formField.value}
                  onStrengthChange={onPasswordStrengthChange}
                />
              )}
            </>
          )}
        </>
      )

    default:
      return null
  }
}
