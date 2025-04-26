"use client"

import { Input } from "@/components/ui/inputs/input"
import { Label } from "@/components/ui/labels"

import { cn } from "@/utils/cn"
import * as React from "react"

import type { FieldError } from "react-hook-form"

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean
  hasErrors?: FieldError | undefined | boolean
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    { className, placeholder, type, isPassword, disabled, hasErrors, ...props },
    ref,
  ) => {
    return (
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        isPassword={isPassword}
        className={cn(
          "peer",
          hasErrors
            ? "focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0"
            : "",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
FloatingInput.displayName = "FloatingInput"

const FloatingLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & { hasErrors?: boolean }
>(({ className, hasErrors, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary -translate-y-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-4 absolute start-2 top-2 z-10 origin-[0] scale-75 transform bg-background px-2 text-gray-500 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:rtl:left-auto peer-focus:rtl:translate-x-1/4 dark:bg-background",
        className,
        hasErrors ? "text-red-600" : "",
      )}
      ref={ref}
      {...props}
    />
  )
})
FloatingLabel.displayName = "FloatingLabel"

type FloatingLabelInputProps = FloatingInputProps & {
  label?: string
}

const FloatingLabelInput = React.forwardRef<
  React.ComponentRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, disabled, hasErrors, isPassword, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput
        ref={ref}
        id={id}
        disabled={disabled}
        hasErrors={hasErrors}
        isPassword={isPassword}
        {...props}
      />
      <FloatingLabel htmlFor={id} hasErrors={!!hasErrors}>
        {label}
      </FloatingLabel>
    </div>
  )
})
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingInput, FloatingLabel, FloatingLabelInput }
