"use client"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/buttons/button"

import { cn } from "@/utils/cn"

interface Props {
  children?: React.ReactNode
  asChild?: boolean
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  disabled?: boolean
  onClick?: () => void
  buttonClassName?: string
  title?: string
  icon?: React.ReactNode
  position?: string
  type?: "button" | "submit" | "reset" | undefined
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "expandIcon"
    | "ringHover"
    | "shine"
    | "gooeyRight"
    | "gooeyLeft"
    | "linkHover1"
    | "linkHover2"
    | null
    | undefined
  titleClassName?: string
}

export const DynamicButton = ({
  children,
  asChild,
  size,
  disabled,
  onClick,
  buttonClassName,
  title,
  type,
  icon,
  position,
  variant,
  titleClassName,
}: Props) => {
  const content = (
    <>
      {!disabled && position === "left" && icon}

      <span
        className={cn(`${titleClassName}`, disabled ? "animate-pulse" : "")}
      >
        {disabled && <Loader2 className="size-4 animate-spin" />}
        {!disabled && title}
      </span>
      {!disabled && position === "right" && icon}
    </>
  )

  if (asChild) {
    return (
      <Button
        asChild={asChild}
        size={size}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={cn(`${buttonClassName}`)}
        variant={variant}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(`${buttonClassName}`)}
      variant={variant}
    >
      {content}
    </Button>
  )
}
