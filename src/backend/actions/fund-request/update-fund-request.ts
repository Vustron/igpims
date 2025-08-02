import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateFundRequest,
  updateFundRequestSchema,
} from "@/validation/fund-request"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { FundRequestWithUser } from "./find-by-id"
import { PaginatedFundRequestsResponse } from "./find-many"

export async function updateFundRequest(
  id: string,
  payload: Partial<UpdateFundRequest>,
): Promise<FundRequestWithUser> {
  return api.patch<Partial<UpdateFundRequest>, FundRequestWithUser>(
    "fund-requests/update-fund-request",
    payload,
    { params: { id } },
  )
}

export const useUpdateFundRequest = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-fund-request", id],
    mutationFn: async (payload: Partial<UpdateFundRequest>) => {
      const sanitizedData = sanitizer<Partial<UpdateFundRequest>>(
        payload,
        updateFundRequestSchema.partial(),
      )
      return await updateFundRequest(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["fund-request", id] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests"] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests-infinite"] }),
      ])

      const previousFundRequest = queryClient.getQueryData<FundRequestWithUser>(
        ["fund-request", id],
      )
      const previousFundRequests = queryClient.getQueryData(["fund-requests"])
      const previousFundRequestsInfinite = queryClient.getQueryData([
        "fund-requests-infinite",
      ])

      if (previousFundRequest) {
        const optimisticFundRequest: FundRequestWithUser = {
          ...previousFundRequest,
          ...updatedData,
          updatedAt: new Date(),
        }

        queryClient.setQueryData(["fund-request", id], optimisticFundRequest)

        queryClient.setQueriesData<PaginatedFundRequestsResponse>(
          { queryKey: ["fund-requests"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((fundRequest: any) =>
                fundRequest.id === id ? optimisticFundRequest : fundRequest,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["fund-requests-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map(
                (page: PaginatedFundRequestsResponse) => ({
                  ...page,
                  data: page.data.map((fundRequest) =>
                    fundRequest.id === id ? optimisticFundRequest : fundRequest,
                  ),
                }),
              ),
            }
          },
        )
      }

      return {
        previousFundRequest,
        previousFundRequests,
        previousFundRequestsInfinite,
      }
    },
    onSuccess: (updatedFundRequest: FundRequestWithUser) => {
      queryClient.setQueryData(["fund-request", id], updatedFundRequest)

      queryClient.setQueriesData<PaginatedFundRequestsResponse>(
        { queryKey: ["fund-requests"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((fundRequest: any) =>
              fundRequest.id === id ? updatedFundRequest : fundRequest,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["fund-requests-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedFundRequestsResponse) => ({
              ...page,
              data: page.data.map((fundRequest) =>
                fundRequest.id === id ? updatedFundRequest : fundRequest,
              ),
            })),
          }
        },
      )
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
