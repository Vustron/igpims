"use client"

import { motion } from "framer-motion"

import { usePasswordStrength } from "@/hooks/use-password-strength"
import { useEffect } from "react"

interface PasswordStrengthMeterProps {
  password: string | undefined | null
  onStrengthChange?: (isStrong: boolean) => void
}

export const PasswordStrengthMeter = ({
  password,
  onStrengthChange,
}: PasswordStrengthMeterProps) => {
  const { score, message, isStrong } = usePasswordStrength(password)

  useEffect(() => {
    onStrengthChange?.(isStrong)
  }, [isStrong, onStrengthChange])

  const getColor = () => {
    switch (score) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-orange-500"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-blue-500"
      case 5:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(score / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className={`mt-1 text-sm ${getColor().replace("bg-", "text-")}`}>
        {message}
      </p>
    </div>
  )
}
