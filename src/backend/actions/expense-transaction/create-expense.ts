import { ExpenseTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateExpenseTransaction,
  createExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedExpenseTransactionsResponse } from "./find-many"

export async function createExpenseTransaction(
  payload: CreateExpenseTransaction,
): Promise<ExpenseTransaction> {
  return api.post<typeof payload, ExpenseTransaction>(
    "expense-transactions/create-expense",
    payload,
  )
}

export const useCreateExpenseTransaction = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-expense-transaction"],
    mutationFn: async (payload: CreateExpenseTransaction) => {
      const sanitizedData = sanitizer<CreateExpenseTransaction>(
        {
          ...payload,
        },
        createExpenseTransactionSchema,
      )
      return await createExpenseTransaction(sanitizedData)
    },
    onMutate: async (newExpenseTransaction) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["expense-transactions"] }),
        queryClient.cancelQueries({
          queryKey: ["expense-transactions-infinite"],
        }),
        queryClient.cancelQueries({
          queryKey: ["fund-request", newExpenseTransaction.requestId],
        }),
        queryClient.cancelQueries({ queryKey: ["fund-requests"] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests-infinite"] }),
      ])

      const previousExpenseTransactions = queryClient.getQueryData([
        "expense-transactions",
      ])
      const previousExpenseTransactionsInfinite = queryClient.getQueryData([
        "expense-transactions-infinite",
      ])

      const optimisticExpenseTransaction = {
        ...newExpenseTransaction,
        id: `temp-${Date.now()}`,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        rejectionReason: null,
        receipt: null,
      }

      queryClient.setQueriesData<PaginatedExpenseTransactionsResponse>(
        { queryKey: ["expense-transactions"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticExpenseTransaction, ...oldData.data]
            const newTotalItems = oldData.meta.totalItems + 1

            return {
              ...oldData,
              data: updatedData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / oldData.meta.limit),
                hasNextPage:
                  oldData.meta.page <
                  Math.ceil(newTotalItems / oldData.meta.limit),
                hasPrevPage: oldData.meta.page > 1,
              },
            }
          }

          return {
            ...oldData,
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems + 1,
              totalPages: Math.ceil(
                (oldData.meta.totalItems + 1) / oldData.meta.limit,
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["expense-transactions-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticExpenseTransaction, ...updatedPages[0].data],
              meta: {
                ...updatedPages[0].meta,
                totalItems: updatedPages[0].meta.totalItems + 1,
                totalPages: Math.ceil(
                  (updatedPages[0].meta.totalItems + 1) /
                    updatedPages[0].meta.limit,
                ),
              },
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      queryClient.setQueryData(
        ["fund-request", newExpenseTransaction.requestId],
        (oldData: any) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            expenseTransactions: [
              optimisticExpenseTransaction,
              ...(oldData.expenseTransactions || []),
            ],
          }
        },
      )

      return {
        previousExpenseTransactions,
        previousExpenseTransactionsInfinite,
        optimisticExpenseTransaction,
      }
    },
    onSuccess: (newExpenseTransaction, _variables, _context) => {
      queryClient.setQueryData(
        ["expense-transaction", newExpenseTransaction.id],
        newExpenseTransaction,
      )

      queryClient.setQueriesData<PaginatedExpenseTransactionsResponse>(
        { queryKey: ["expense-transactions"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => item?.id && !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newExpenseTransaction,
              ...filteredData.slice(0, oldData.meta.limit - 1),
            ]

            return {
              ...oldData,
              data: updatedData,
            }
          }

          return oldData
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["expense-transactions-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedExpenseTransactionsResponse) => {
              const filteredData = page.data.filter(
                (item) => item?.id && !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newExpenseTransaction, ...filteredData]
                    : filteredData,
              }
            },
          )

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      queryClient.setQueryData(
        ["fund-request", newExpenseTransaction.requestId],
        (oldData: any) => {
          if (!oldData) return oldData

          const filteredTransactions = (
            oldData.expenseTransactions || []
          ).filter(
            (item: any) => item?.id && !item.id.toString().startsWith("temp-"),
          )

          return {
            ...oldData,
            expenseTransactions: [
              newExpenseTransaction,
              ...filteredTransactions,
            ],
          }
        },
      )
    },

    onError: (error, _variables, context) => {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-transactions"] })
      queryClient.invalidateQueries({
        queryKey: ["expense-transactions-infinite"],
      })
      queryClient.invalidateQueries({ queryKey: ["fund-requests"] })
      queryClient.invalidateQueries({ queryKey: ["fund-requests-infinite"] })
      router.push("/fund-request")
      router.refresh()
    },
  })
}
