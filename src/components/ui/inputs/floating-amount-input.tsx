"use client"

import CurrencyInput from "react-currency-input-field"
import { FloatingLabel } from "@/components/ui/inputs"
import { cn } from "@/utils/cn"

interface FloatingLabelAmountInputProps {
  id: string
  value: string | number
  onChange: (value: string | undefined) => void
  label: string
  placeholder?: string
  disabled?: boolean
  hasErrors?: boolean
  className?: string
}

export const FloatingLabelAmountInput = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  disabled,
  hasErrors = false,
  className = "",
}: FloatingLabelAmountInputProps) => {
  const inputValue = typeof value === "number" ? value.toString() : value

  return (
    <div className="relative">
      <CurrencyInput
        id={id}
        prefix="₱"
        className={cn(
          "peer h-12 w-full rounded-md border border-input bg-background px-3 py-2 pt-5 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          hasErrors ? "border-red-600 focus-visible:ring-red-600" : "",
          className,
        )}
        placeholder={placeholder}
        value={inputValue}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
      />
      <FloatingLabel
        htmlFor={id}
        hasErrors={hasErrors}
        className={cn(
          "z-10",
          value !== undefined && value !== "" ? "-translate-y-3 scale-75" : "",
        )}
      >
        {label}
      </FloatingLabel>
    </div>
  )
}
