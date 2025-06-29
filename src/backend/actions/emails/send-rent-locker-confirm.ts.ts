import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
// import { sanitizer } from "@/utils/sanitizer"

export async function sendRentLockerConfirm(payload: any) {
  return api.post<any>("email/send-rent-locker-confirm", payload)
}

export const useSendRentLockerConfirm = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`send-rent-locker-confirm-email-${new Date()}`],
    mutationFn: async (payload: any) => {
      // const sanitizedData = sanitizer<LockerRentEmailPayload>(
      //   payload,
      //   lockerRentRecipientSchema,
      // )
      return await sendRentLockerConfirm(payload)
    },
    onSuccess: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
