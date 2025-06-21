"use client"

import { SelectProps } from "@radix-ui/react-select"
import * as React from "react"
import { FieldErrors, FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/labels"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { cn } from "@/utils/cn"

interface FloatingSelectProps extends SelectProps {
  options: Array<{ value: string; label: string }>
  label?: string
  hasErrors?: FieldErrors<FieldValues> | undefined | boolean
  placeholder?: string
  className?: string
}

const FloatingLabelSelect = React.forwardRef<
  HTMLButtonElement,
  FloatingSelectProps
>(({ options, label, hasErrors, placeholder, className, ...props }, ref) => {
  return (
    <div className="relative">
      <Select {...props}>
        <SelectTrigger
          ref={ref}
          className={cn(
            "peer h-10 w-[150px]",
            hasErrors
              ? "border-red-500 focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0"
              : "",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="w-[var(--radix-select-trigger-width)] min-w-[200px]"
          position="popper"
          sideOffset={5}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label
        className={cn(
          "peer-focus:secondary peer-focus:dark:secondary -translate-y-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-4 absolute start-2 top-2 z-10 w-auto origin-[0] scale-75 transform bg-background px-2 text-gray-500 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:rtl:left-auto peer-focus:rtl:translate-x-1/4 dark:bg-background",
          hasErrors ? "text-red-600" : "",
        )}
      >
        {label}
      </Label>
    </div>
  )
})
FloatingLabelSelect.displayName = "FloatingSelect"

export { FloatingLabelSelect as FloatingSelect }
