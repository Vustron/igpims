import { useState, useEffect } from "react"

export type PasswordStrength = {
  score: number
  message: string
  isStrong: boolean
}

export const usePasswordStrength = (
  password: string | undefined | null,
): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    message: "",
    isStrong: false,
  })

  useEffect(() => {
    const calculateStrength = (pwd: string) => {
      let score = 0
      if (pwd.length >= 12) score++
      if (/[a-z]/.test(pwd)) score++
      if (/[A-Z]/.test(pwd)) score++
      if (/\d/.test(pwd)) score++
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++
      return score
    }

    if (!password) {
      setStrength({ score: 0, message: "", isStrong: false })
      return
    }

    const score = calculateStrength(password)
    let message = ""
    let isStrong = false

    switch (score) {
      case 0:
      case 1:
        message = "Very weak"
        break
      case 2:
        message = "Weak"
        break
      case 3:
        message = "Moderate"
        break
      case 4:
        message = "Strong"
        isStrong = true
        break
      case 5:
        message = "Very strong"
        isStrong = true
        break
    }

    setStrength({ score, message, isStrong })
  }, [password])

  return strength
}
