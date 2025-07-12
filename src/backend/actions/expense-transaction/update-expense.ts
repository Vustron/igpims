import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateExpenseTransaction,
  updateExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { ExpenseTransactionWithDetails } from "./find-by-id"
import { PaginatedExpenseTransactionsResponse } from "./find-many"

export async function updateExpenseTransaction(
  id: string,
  payload: Partial<UpdateExpenseTransaction>,
): Promise<ExpenseTransactionWithDetails> {
  return api.patch<
    Partial<UpdateExpenseTransaction>,
    ExpenseTransactionWithDetails
  >("expense-transactions/update-expense", payload, { params: { id } })
}

export const useUpdateExpenseTransaction = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-expense-transaction", id],
    mutationFn: async (payload: Partial<UpdateExpenseTransaction>) => {
      const sanitizedData = sanitizer<Partial<UpdateExpenseTransaction>>(
        payload,
        updateExpenseTransactionSchema.partial(),
      )
      return await updateExpenseTransaction(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["expense-transaction", id] }),
        queryClient.cancelQueries({ queryKey: ["expense-transactions"] }),
        queryClient.cancelQueries({
          queryKey: ["expense-transactions-infinite"],
        }),
        queryClient.cancelQueries({
          queryKey: ["fund-request", updatedData.requestId],
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

      if (previousExpenseTransaction) {
        const optimisticExpenseTransaction: ExpenseTransactionWithDetails = {
          ...previousExpenseTransaction,
          ...updatedData,
          updatedAt: new Date(),
        }

        queryClient.setQueryData(
          ["expense-transaction", id],
          optimisticExpenseTransaction,
        )

        queryClient.setQueriesData<PaginatedExpenseTransactionsResponse>(
          { queryKey: ["expense-transactions"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((expense: any) =>
                expense.id === id ? optimisticExpenseTransaction : expense,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["expense-transactions-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map(
                (page: PaginatedExpenseTransactionsResponse) => ({
                  ...page,
                  data: page.data.map((expense) =>
                    expense.id === id ? optimisticExpenseTransaction : expense,
                  ),
                }),
              ),
            }
          },
        )

        if (previousExpenseTransaction.requestId) {
          queryClient.setQueryData(
            ["fund-request", previousExpenseTransaction.requestId],
            (oldData: any) => {
              if (!oldData?.expenseTransactions) return oldData
              return {
                ...oldData,
                expenseTransactions: oldData.expenseTransactions.map(
                  (expense: any) =>
                    expense.id === id ? optimisticExpenseTransaction : expense,
                ),
              }
            },
          )
        }
      }

      return {
        previousExpenseTransaction,
        previousExpenseTransactions,
        previousExpenseTransactionsInfinite,
      }
    },
    onSuccess: (updatedExpenseTransaction: ExpenseTransactionWithDetails) => {
      queryClient.setQueryData(
        ["expense-transaction", id],
        updatedExpenseTransaction,
      )

      queryClient.setQueriesData<PaginatedExpenseTransactionsResponse>(
        { queryKey: ["expense-transactions"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((expense: any) =>
              expense.id === id ? updatedExpenseTransaction : expense,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["expense-transactions-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map(
              (page: PaginatedExpenseTransactionsResponse) => ({
                ...page,
                data: page.data.map((expense) =>
                  expense.id === id ? updatedExpenseTransaction : expense,
                ),
              }),
            ),
          }
        },
      )

      if (updatedExpenseTransaction.requestId) {
        queryClient.setQueryData(
          ["fund-request", updatedExpenseTransaction.requestId],
          (oldData: any) => {
            if (!oldData?.expenseTransactions) return oldData
            return {
              ...oldData,
              expenseTransactions: oldData.expenseTransactions.map(
                (expense: any) =>
                  expense.id === id ? updatedExpenseTransaction : expense,
              ),
            }
          },
        )
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
