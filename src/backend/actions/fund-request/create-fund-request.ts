import { FundRequest } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateFundRequest,
  createFundRequestSchema,
} from "@/validation/fund-request"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedFundRequestsResponse } from "./find-many"

export async function createFundRequest(
  payload: CreateFundRequest,
): Promise<FundRequest> {
  return api.post<typeof payload, FundRequest>(
    "fund-requests/create-fund-request",
    payload,
  )
}

export const useCreateFundRequest = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-fund-request"],
    mutationFn: async (payload: CreateFundRequest) => {
      const sanitizedData = sanitizer<CreateFundRequest>(
        {
          ...payload,
        },
        createFundRequestSchema,
      )
      return await createFundRequest(sanitizedData)
    },
    onMutate: async (newFundRequest) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["fund-requests"] }),
        queryClient.cancelQueries({ queryKey: ["fund-requests-infinite"] }),
      ])

      const previousFundRequests = queryClient.getQueryData(["fund-requests"])
      const previousFundRequestsInfinite = queryClient.getQueryData([
        "fund-requests-infinite",
      ])

      const optimisticFundRequest = {
        ...newFundRequest,
        id: `temp-${Date.now()}`,
        status: "pending",
        currentStep: 1,
        isRejected: false,
        rejectionStep: 0,
        utilizedFunds: 0,
        allocatedFunds: 0,
        rejectionReason: null,
        notes: null,
        reviewerComments: null,
        disbursementDate: null,
        receiptDate: null,
        validationDate: null,
        receipts: [],
        approvedBy: null,
        requestorPosition: newFundRequest.position || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueriesData<PaginatedFundRequestsResponse>(
        { queryKey: ["fund-requests"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticFundRequest, ...oldData.data]
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
        { queryKey: ["fund-requests-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticFundRequest, ...updatedPages[0].data],
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

      return {
        previousFundRequests,
        previousFundRequestsInfinite,
        optimisticFundRequest,
      }
    },
    onSuccess: (newFundRequest: FundRequest, _variables, _context) => {
      queryClient.setQueryData(
        ["fund-request", newFundRequest.id],
        newFundRequest,
      )

      queryClient.setQueriesData<PaginatedFundRequestsResponse>(
        { queryKey: ["fund-requests"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newFundRequest,
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
        { queryKey: ["fund-requests-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedFundRequestsResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newFundRequest, ...filteredData]
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
    },
    onError: (error, _variables, context) => {
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
      queryClient.invalidateQueries({ queryKey: ["fund-requests-infinite"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      router.refresh()
    },
  })
}
