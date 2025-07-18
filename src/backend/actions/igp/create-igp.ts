import { Igp } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { CreateIgpPayload, createIgpSchema } from "@/validation/igp"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedIgpResponse } from "./find-many"

export async function createIgp(payload: CreateIgpPayload): Promise<Igp> {
  return api.post<typeof payload, Igp>("igps/create-igp", payload)
}

export const useCreateIgp = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-igp"],
    mutationFn: async (payload: CreateIgpPayload) => {
      const sanitizedData = sanitizer<CreateIgpPayload>(
        {
          ...payload,
        },
        createIgpSchema,
      )
      return await createIgp(sanitizedData)
    },
    onMutate: async (newIgp) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igps"] }),
        queryClient.cancelQueries({ queryKey: ["igp-infinite"] }),
      ])

      const previousIgp = queryClient.getQueryData(["igps"])
      const previousIgpInfinite = queryClient.getQueryData(["igp-infinite"])

      const optimisticIgp = {
        ...newIgp,
        id: `temp-${Date.now()}`,
        status: "pending",
        currentStep: 1,
        isRejected: false,
        rejectionStep: 0,
        totalSold: 0,
        igpRevenue: 0,
        rejectionReason: null,
        notes: null,
        reviewerComments: null,
        projectDocument: null,
        resolutionDocument: null,
        submissionDate: null,
        approvalDate: null,
        requestDate: new Date(),
        dateNeeded: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedOfficers: newIgp.assignedOfficers || [],
        transactions: [],
        supplies: [],
      }

      queryClient.setQueriesData<PaginatedIgpResponse>(
        { queryKey: ["igp"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticIgp, ...oldData.data]
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
        { queryKey: ["igp-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticIgp, ...updatedPages[0].data],
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
        previousIgp,
        previousIgpInfinite,
        optimisticIgp,
      }
    },
    onSuccess: (newIgp: Igp, _variables, _context) => {
      queryClient.setQueryData(["igp", newIgp.id], newIgp)

      queryClient.setQueriesData<PaginatedIgpResponse>(
        { queryKey: ["igps"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newIgp,
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
        { queryKey: ["igp-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedIgpResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newIgp, ...filteredData]
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
      if (context?.previousIgp) {
        queryClient.setQueryData(["igps"], context.previousIgp)
      }
      if (context?.previousIgpInfinite) {
        queryClient.setQueryData(["igp-infinite"], context.previousIgpInfinite)
      }
      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      queryClient.invalidateQueries({ queryKey: ["igp-infinite"] })
      router.refresh()
    },
  })
}
