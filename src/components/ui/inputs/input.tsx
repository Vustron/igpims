"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/buttons"

import { useState } from "react"

import { cn } from "@/utils/cn"

import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isPassword, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // Determine the correct type based on isPassword and showPassword
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          data-slot="input"
          className={cn(
            "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-ring/50 ring-ring/10 transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-1 focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive/60 aria-invalid:outline-destructive/60 aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 aria-invalid:ring-destructive/20 aria-invalid:focus-visible:outline-none aria-invalid:focus-visible:ring-[3px] md:text-sm dark:outline-ring/40 dark:ring-ring/20 dark:aria-invalid:border-destructive dark:aria-invalid:outline-destructive dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 dark:aria-invalid:ring-destructive/50 dark:aria-invalid:focus-visible:ring-4",
            isPassword ? "hide-password-toggle pr-10" : "",
            className,
          )}
          ref={ref}
          {...props}
        />

        {isPassword && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={props.disabled}
            >
              {showPassword && !props.disabled ? (
                <EyeIcon className="size-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>

            <style jsx global>{`
              .hide-password-toggle::-ms-reveal,
              .hide-password-toggle::-ms-clear {
                visibility: hidden;
                pointer-events: none;
                display: none;
              }
            `}</style>
          </>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
