import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpTransactionWithRelations } from "./find-by-id"
import { PaginatedIgpTransactionResponse } from "./find-many"

export async function deleteIgpTransaction(id: string) {
  return api.delete<IgpTransactionWithRelations>(
    "igp-transactions/delete-igp-transaction",
    {
      params: { id },
    },
  )
}

export const useDeleteIgpTransaction = (id: string, igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-igp-transaction", id],
    mutationFn: async () => {
      return await deleteIgpTransaction(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igp-transaction", id] }),
        queryClient.cancelQueries({ queryKey: ["igp-transactions", igpId] }),
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

      if (igpId && previousTransactions) {
        queryClient.setQueryData(
          ["igp-transactions", igpId],
          (oldData: PaginatedIgpTransactionResponse | undefined) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.filter((txn) => txn.id !== id),
              meta: {
                ...oldData.meta,
                totalItems: Math.max(0, oldData.meta.totalItems - 1),
                totalPages: Math.max(
                  1,
                  Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
                ),
              },
              summary:
                previousTransaction && previousTransactions.summary
                  ? {
                      ...previousTransactions.summary,
                      totalTransactions:
                        previousTransactions.summary.totalTransactions - 1,
                      totalAmount:
                        previousTransactions.summary.totalAmount -
                        previousTransaction.quantity *
                          (previousTransaction.igp?.costPerItem || 0),
                      totalQuantity:
                        previousTransactions.summary.totalQuantity -
                        previousTransaction.quantity,
                    }
                  : previousTransactions.summary,
            }
          },
        )
      }

      if (igpId && previousIgp && previousTransaction) {
        queryClient.setQueryData(["igp", igpId], (oldIgp: any) => ({
          ...oldIgp,
          totalSold: oldIgp.totalSold - previousTransaction.quantity,
          igpRevenue:
            oldIgp.igpRevenue -
            previousTransaction.quantity *
              (previousTransaction.igp?.costPerItem || 0),
        }))
      }

      return {
        previousTransaction,
        previousTransactions,
        previousIgp,
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ["igp-transactions", id] })
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp", igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
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

      return catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
