import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { ExpenseTransactionWithDetails } from "./find-by-id"
import { PaginatedExpenseTransactionsResponse } from "./find-many"

export async function deleteExpenseTransaction(id: string) {
  return api.delete<ExpenseTransactionWithDetails>(
    "expense-transactions/delete-expense",
    {
      params: { id },
    },
  )
}

export const useDeleteExpenseTransaction = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-expense-transaction", id],
    mutationFn: async () => {
      return await deleteExpenseTransaction(id)
    },
    onMutate: async () => {
      const expenseToDelete =
        queryClient.getQueryData<ExpenseTransactionWithDetails>([
          "expense-transaction",
          id,
        ])

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["expense-transactions"] }),
        queryClient.cancelQueries({ queryKey: ["expense-transaction", id] }),
        queryClient.cancelQueries({
          queryKey: ["expense-transactions-infinite"],
        }),
        expenseToDelete?.requestId &&
          queryClient.cancelQueries({
            queryKey: ["fund-request", expenseToDelete.requestId],
          }),
        queryClient.cancelQueries({ queryKey: ["fund-requests"] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests-infinite"] }),
      ])

      const previousExpenseTransaction =
        queryClient.getQueryData<ExpenseTransactionWithDetails>([
          "expense-transaction",
          id,
        ])
      const previousExpenseTransactions = queryClient.getQueryData([
        "expense-transactions",
      ])
      const previousExpenseTransactionsInfinite = queryClient.getQueryData([
        "expense-transactions-infinite",
      ])

      queryClient.setQueriesData<PaginatedExpenseTransactionsResponse>(
        { queryKey: ["expense-transactions"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((expense) => expense.id !== id),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["expense-transactions-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (expense: ExpenseTransactionWithDetails) => expense.id !== id,
              ),
              meta: {
                ...page.meta,
                totalItems: Math.max(0, page.meta.totalItems - 1),
                totalPages: Math.max(
                  1,
                  Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                ),
              },
            })),
          }
        },
      )

      if (expenseToDelete?.requestId) {
        queryClient.setQueryData(
          ["fund-request", expenseToDelete.requestId],
          (oldData: any) => {
            if (!oldData?.expenseTransactions) return oldData
            return {
              ...oldData,
              expenseTransactions: oldData.expenseTransactions.filter(
                (expense: any) => expense.id !== id,
              ),
            }
          },
        )
      }

      return {
        previousExpenseTransaction,
        previousExpenseTransactions,
        previousExpenseTransactionsInfinite,
        expenseToDelete,
      }
    },
    onSuccess: (_data, _variables, context) => {
      queryClient.removeQueries({ queryKey: ["expense-transaction", id] })

      if (context?.expenseToDelete?.requestId) {
        queryClient.invalidateQueries({
          queryKey: ["fund-request", context.expenseToDelete.requestId],
        })
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousExpenseTransaction) {
        queryClient.setQueryData(
          ["expense-transaction", id],
          context.previousExpenseTransaction,
        )
      }
      if (context?.previousExpenseTransactions) {
        queryClient.setQueryData(
          ["expense-transactions"],
          context.previousExpenseTransactions,
        )
      }
      if (context?.previousExpenseTransactionsInfinite) {
        queryClient.setQueryData(
          ["expense-transactions-infinite"],
          context.previousExpenseTransactionsInfinite,
        )
      }

      if (context?.expenseToDelete?.requestId) {
        queryClient.invalidateQueries({
          queryKey: ["fund-request", context.expenseToDelete.requestId],
        })
      }

      catchError(error)
    },
    onSettled: (context) => {
      queryClient.invalidateQueries({ queryKey: ["expense-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["expense-transaction", id] })
      queryClient.invalidateQueries({
        queryKey: ["expense-transactions-infinite"],
      })
      if (context?.requestId) {
        queryClient.invalidateQueries({
          queryKey: ["fund-request", context?.requestId],
        })
        queryClient.invalidateQueries({ queryKey: ["fund-requests"] })
        queryClient.invalidateQueries({ queryKey: ["fund-requests-infinite"] })
      }
      router.refresh()
    },
  })
}
