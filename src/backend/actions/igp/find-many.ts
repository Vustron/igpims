import { User } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface IgpFilters {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  status?: string
  projectLead?: string
  igpType?: string
  semesterAndAcademicYear?: string
}

export interface PaginatedIgpResponse {
  data: (IgpWithProjectLeadData & {
    projectLeadData?: {
      id: string
      name: string
      email: string
      role: string
      image: string | null
      emailVerified: boolean
      sessionExpired: boolean
      createdAt: number
      updatedAt: number
    }
    transactions?: {
      id: string
      igpId: string
      purchaserName: string
      courseAndSet: string
      batch: number
      quantity: number
      dateBought: number
      itemReceived: "pending" | "received" | "cancelled"
      createdAt: number
      updatedAt: number
    }[]
    supplies?: {
      id: string
      igpId: string
      supplyDate: number
      quantitySold: number
      unitPrice: number
      totalRevenue: number
      createdAt: number
      updatedAt: number
    }[]
  })[]
  users: User[]
  revenueData: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalItemsSold: number
    averageRevenuePerItem: number
  }
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface IgpWithProjectLeadData {
  id: string
  igpName: string
  igpDescription: string
  igpType: "permanent" | "temporary" | "maintenance"
  iconType:
    | "store"
    | "card"
    | "tag"
    | "package"
    | "shirt"
    | "food"
    | "coffee"
    | "bakery"
    | "event"
    | "book"
    | "tech"
    | "education"
    | "service"
    | "craft"
    | "sports"
    | "ticket"
    | "research"
    | "printing"
    | "media"
    | "farm"
    | "vendo"
    | "music"
    | "health"
    | "donation"
    | "art"
    | "rental"
    | "newspaper"
    | "pin"
  semesterAndAcademicYear: string
  totalSold: number
  igpRevenue: number
  igpStartDate: number
  igpEndDate: number
  igpDateNeeded: number
  itemsToSell: string
  assignedOfficers: string[]
  estimatedQuantities: number
  budget: number
  costPerItem: number
  projectLead: string
  department: string
  position: string
  typeOfTransaction: string
  status:
    | "pending"
    | "in_review"
    | "checking"
    | "approved"
    | "in_progress"
    | "completed"
    | "rejected"
  currentStep: number
  requestDate: number
  dateNeeded: number
  isRejected: boolean
  rejectionStep: number
  rejectionReason: string
  notes: string
  reviewerComments: string
  projectDocument: string
  resolutionDocument: string
  submissionDate: number
  approvalDate: number
  createdAt: number
  updatedAt: number
  projectLeadData?: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
  }
}

export async function findManyIgp(
  filters: IgpFilters = {},
): Promise<PaginatedIgpResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    projectLead,
    igpType,
    semesterAndAcademicYear,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)
  if (status) params.append("status", status)
  if (projectLead) params.append("projectLead", projectLead)
  if (igpType) params.append("igpType", igpType)
  if (semesterAndAcademicYear)
    params.append("semesterAndAcademicYear", semesterAndAcademicYear)

  const queryString = params.toString()
  return await api.get<PaginatedIgpResponse>(`igps/find-many?${queryString}`)
}

export async function preFindManyIgp(filters: IgpFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      sort,
      status,
      projectLead,
      igpType,
      semesterAndAcademicYear,
    } = filters

    return queryOptions({
      queryKey: [
        "igp",
        {
          page,
          limit,
          search,
          startDate,
          endDate,
          sort,
          status,
          projectLead,
          igpType,
          semesterAndAcademicYear,
        },
      ],
      queryFn: async () => await findManyIgp(filters),
    })
  }
}

export const useFindManyIgp = (filters: IgpFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    projectLead,
    igpType,
    semesterAndAcademicYear,
  } = filters

  return useQuery<PaginatedIgpResponse>({
    queryKey: [
      "igp",
      {
        page,
        limit,
        search,
        startDate,
        endDate,
        sort,
        status,
        projectLead,
        igpType,
        semesterAndAcademicYear,
      },
    ],
    queryFn: async () => await findManyIgp(filters),
  })
}

export const useInfiniteFindManyIgp = (
  filters: Omit<IgpFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    projectLead,
    igpType,
    semesterAndAcademicYear,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "igp-infinite",
      {
        limit,
        search,
        startDate,
        endDate,
        sort,
        status,
        projectLead,
        igpType,
        semesterAndAcademicYear,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyIgp({
        ...filters,
        page: pageParam,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.hasPrevPage ? firstPage.meta.page - 1 : undefined,
  })
}
