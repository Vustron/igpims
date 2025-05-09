"use client"

import CurrencyInput from "react-currency-input-field"

type AmountInputProps = {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
}: AmountInputProps) => {
  return (
    <CurrencyInput
      prefix="₱"
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      placeholder={placeholder}
      value={value}
      decimalsLimit={2}
      decimalScale={2}
      onValueChange={onChange}
      disabled={disabled}
    />
  )
}

export default AmountInput
