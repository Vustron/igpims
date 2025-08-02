import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { FundRequestWithUser } from "./find-by-id"
import { PaginatedFundRequestsResponse } from "./find-many"

export async function deleteFundRequest(id: string) {
  return api.delete<FundRequestWithUser>("fund-requests/delete-fund-request", {
    params: { id },
  })
}

export const useDeleteFundRequest = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-fund-request", id],
    mutationFn: async () => {
      return await deleteFundRequest(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["fund-requests"] }),
        queryClient.cancelQueries({ queryKey: ["fund-request", id] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests-infinite"] }),
      ])

      const previousFundRequest = queryClient.getQueryData<FundRequestWithUser>(
        ["fund-request", id],
      )
      const previousFundRequests = queryClient.getQueryData(["fund-requests"])
      const previousFundRequestsInfinite = queryClient.getQueryData([
        "fund-requests-infinite",
      ])

      queryClient.setQueriesData<PaginatedFundRequestsResponse>(
        { queryKey: ["fund-requests"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((fundRequest) => fundRequest.id !== id),
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
        { queryKey: ["fund-requests-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (fundRequest: FundRequestWithUser) => fundRequest.id !== id,
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

      return {
        previousFundRequest,
        previousFundRequests,
        previousFundRequestsInfinite,
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["fund-request", id] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousFundRequest) {
        queryClient.setQueryData(
          ["fund-request", id],
          context.previousFundRequest,
        )
      }
      if (context?.previousFundRequests) {
        queryClient.setQueryData(
          ["fund-requests"],
          context.previousFundRequests,
        )
      }
      if (context?.previousFundRequestsInfinite) {
        queryClient.setQueryData(
          ["fund-requests-infinite"],
          context.previousFundRequestsInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fund-requests"] })
      queryClient.invalidateQueries({ queryKey: ["fund-request", id] })
      queryClient.invalidateQueries({ queryKey: ["fund-requests-infinite"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      router.refresh()
    },
  })
}
