import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateIgpTransactionPayload,
  updateIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpTransactionWithRelations } from "./find-by-id"
import { PaginatedIgpTransactionResponse } from "./find-many"

export async function updateIgpTransaction(
  id: string,
  payload: Partial<UpdateIgpTransactionPayload>,
): Promise<IgpTransactionWithRelations> {
  return api.patch<
    Partial<UpdateIgpTransactionPayload>,
    IgpTransactionWithRelations
  >("igp-transactions/update-igp-transaction", payload, {
    params: { id },
  })
}

export const useUpdateIgpTransaction = (id: string, igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-igp-transaction", id],
    mutationFn: async (payload: Partial<UpdateIgpTransactionPayload>) => {
      const sanitizedData = sanitizer<Partial<UpdateIgpTransactionPayload>>(
        payload,
        updateIgpTransactionSchema.partial(),
      )
      return await updateIgpTransaction(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igp-transactions", id] }),
        queryClient.cancelQueries({ queryKey: ["igp-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["igp-transactions"] }),
        queryClient.cancelQueries({ queryKey: ["igp", igpId] }),
        queryClient.cancelQueries({ queryKey: ["igps"] }),
      ])

      const previousTransaction =
        queryClient.getQueryData<IgpTransactionWithRelations>([
          "igp-transaction",
          id,
        ])
      const previousTransactions =
        queryClient.getQueryData<PaginatedIgpTransactionResponse>([
          "igp-transactions",
          igpId,
        ])
      const previousIgp = queryClient.getQueryData(["igp", igpId])

      if (previousTransaction) {
        const optimisticTransaction = {
          ...previousTransaction,
          ...updatedData,
        }

        queryClient.setQueryData(["igp-transaction", id], optimisticTransaction)

        if (igpId) {
          queryClient.setQueryData(
            ["igp-transactions", igpId],
            (oldData: PaginatedIgpTransactionResponse | undefined) => {
              if (!oldData?.data) return oldData
              return {
                ...oldData,
                data: oldData.data.map((txn) =>
                  txn.id === id ? optimisticTransaction : txn,
                ),
              }
            },
          )
        }

        if (updatedData.quantity !== undefined && igpId && previousIgp) {
          const quantityDiff =
            updatedData.quantity - previousTransaction.quantity
          queryClient.setQueryData(["igp", igpId], (oldIgp: any) => ({
            ...oldIgp,
            totalSold: oldIgp.totalSold + quantityDiff,
            igpRevenue: oldIgp.igpRevenue + quantityDiff * oldIgp.costPerItem,
          }))
        }
      }

      return {
        previousTransaction,
        previousTransactions,
        previousIgp,
      }
    },
    onSuccess: (updatedTransaction) => {
      queryClient.setQueryData(["igp-transaction", id], updatedTransaction)

      if (igpId) {
        queryClient.setQueryData(
          ["igp-transactions", igpId],
          (oldData: PaginatedIgpTransactionResponse | undefined) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((txn) =>
                txn.id === id ? updatedTransaction : txn,
              ),
            }
          },
        )
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousTransaction) {
        queryClient.setQueryData(
          ["igp-transaction", id],
          context.previousTransaction,
        )
      }

      if (context?.previousTransactions && igpId) {
        queryClient.setQueryData(
          ["igp-transactions", igpId],
          context.previousTransactions,
        )
      }

      if (context?.previousIgp && igpId) {
        queryClient.setQueryData(["igp", igpId], context.previousIgp)
      }

      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["igp-transactions", id] })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies"] })
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp", igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      router.refresh()
    },
  })
}
