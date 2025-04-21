import { useMutation } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"

export const generate2FA = () => {
  return api.get<string>("auth/generate-2fa")
}

export const useGenerate2FA = () => {
  return useMutation({
    mutationKey: ["generate-2fa", new Date()],
    mutationFn: generate2FA,
  })
}
