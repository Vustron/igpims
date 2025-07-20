import { IgpTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateIgpTransactionPayload,
  createIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

export async function createIgpTransaction(
  payload: CreateIgpTransactionPayload,
): Promise<IgpTransaction> {
  return api.post<typeof payload, IgpTransaction>(
    "igp-transactions/create-igp-transaction",
    payload,
  )
}

export const useCreateIgpTransaction = (igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-igp-transaction"],
    mutationFn: async (payload: CreateIgpTransactionPayload) => {
      const sanitizedData = sanitizer<CreateIgpTransactionPayload>(
        {
          ...payload,
          igpId: igpId || payload.igpId,
        },
        createIgpTransactionSchema,
      )
      return await createIgpTransaction(sanitizedData)
    },
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({
        queryKey: ["igp-transactions", newTransaction.igpId],
      })

      const previousTransactions = queryClient.getQueryData([
        "igp-transactions",
        newTransaction.igpId,
      ])

      const optimisticTransaction = {
        ...newTransaction,
        id: `temp-${Date.now()}`,
        dateBought: new Date(),
        itemReceived: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData(
        ["igp-transactions", newTransaction.igpId],
        (oldData: IgpTransaction[] | undefined) => {
          return oldData
            ? [optimisticTransaction, ...oldData]
            : [optimisticTransaction]
        },
      )

      queryClient.setQueryData(["igp", newTransaction.igpId], (oldIgp: any) => {
        if (!oldIgp) return oldIgp
        return {
          ...oldIgp,
          totalSold: oldIgp.totalSold + newTransaction.quantity,
          igpRevenue:
            oldIgp.igpRevenue + newTransaction.quantity * oldIgp.costPerItem,
        }
      })

      return { previousTransactions }
    },
    onSuccess: (newTransaction, _variables, _context) => {
      queryClient.setQueryData(
        ["igp-transactions", newTransaction.igpId],
        (oldData: IgpTransaction[] | undefined) => {
          if (!oldData) return [newTransaction]
          return oldData.map((t) =>
            t.id.toString().startsWith("temp-") ? newTransaction : t,
          )
        },
      )
    },
    onError: (error, variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["igp-transactions", variables.igpId],
          context.previousTransactions,
        )
      }

      queryClient.setQueryData(["igp", variables.igpId], (oldIgp: any) => {
        if (!oldIgp) return oldIgp
        return {
          ...oldIgp,
          totalSold: oldIgp.totalSold - variables.quantity,
          igpRevenue:
            oldIgp.igpRevenue - variables.quantity * oldIgp.costPerItem,
        }
      })

      catchError(error)
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["igp-transactions", variables?.igpId],
      })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies"] })
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp", igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      router.refresh()
    },
  })
}
