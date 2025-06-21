import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface ExpenseTransaction {
  id: string
  requestId: string
  expenseName: string
  amount: number
  date: Date
  receipt?: string
  status: "pending" | "validated" | "rejected"
  validatedBy?: string
  validatedDate?: Date
  rejectionReason?: string
}

export interface FundRequest {
  id: string
  purpose: string
  amount: number
  utilizedFunds: number
  allocatedFunds: number
  status:
    | "pending"
    | "in_review"
    | "checking"
    | "approved"
    | "disbursed"
    | "received"
    | "receipted"
    | "validated"
    | "rejected"
  currentStep: number
  requestDate: Date
  dateNeeded?: Date
  lastUpdated: Date
  requestor: string
  position?: string
  isRejected?: boolean
  rejectionStep?: number
  rejectionReason?: string
  notes?: string
  reviewerComments?: string
  disbursementDate?: Date
  receiptDate?: Date
  validationDate?: Date
  receipts?: string[]
  expenses?: ExpenseTransaction[]
}

interface FundRequestStore {
  requests: FundRequest[]
  addRequest: (
    request: Omit<FundRequest, "id" | "lastUpdated" | "currentStep" | "status">,
  ) => string
  updateRequestStatus: (
    id: string,
    status: FundRequest["status"],
    notes?: string,
  ) => void
  approveRequest: (id: string, notes?: string) => void
  rejectRequest: (
    id: string,
    rejectionReason: string,
    rejectionStep?: number,
  ) => void
  moveToNextStep: (id: string, notes?: string) => void
  getRequestById: (id: string) => FundRequest | undefined
  getRequestsByStatus: (status: FundRequest["status"]) => FundRequest[]
  updateAllocatedFunds: (id: string) => void
  addReceipt: (id: string, receipt: string) => void
  updateUtilizedFunds: (id: string, utilizedFunds: number) => void
  addExpenseTransaction: (
    requestId: string,
    expense: Omit<ExpenseTransaction, "id" | "requestId">,
  ) => string
  updateExpenseStatus: (
    requestId: string,
    expenseId: string,
    status: ExpenseTransaction["status"],
    validatedBy?: string,
    rejectionReason?: string,
  ) => void
  getExpensesByRequestId: (requestId: string) => ExpenseTransaction[]
  deleteRequest: (id: string) => void
  deleteManyRequests: (ids: string[]) => void
}

const statusToStepMap: Record<FundRequest["status"], number> = {
  pending: 1,
  in_review: 2,
  checking: 3,
  approved: 4,
  disbursed: 5,
  received: 6,
  receipted: 7,
  validated: 8,
  rejected: 0,
}

const stepToStatusMap: Record<number, FundRequest["status"]> = {
  1: "pending",
  2: "in_review",
  3: "checking",
  4: "approved",
  5: "disbursed",
  6: "received",
  7: "receipted",
  8: "validated",
}

export const useFundRequestStore = create<FundRequestStore>()(
  persist(
    (set, get) => ({
      requests: [],

      addRequest: (requestData) => {
        const newRequest: FundRequest = {
          ...requestData,
          id: `FR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
          requestDate: new Date(),
          lastUpdated: new Date(),
          currentStep: 1,
          status: "pending",
          utilizedFunds: 0,
          allocatedFunds: 0,
          expenses: [],
        }

        set((state) => ({
          requests: [...state.requests, newRequest],
        }))

        return newRequest.id
      },

      updateRequestStatus: (id, status, notes) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status,
                  currentStep: statusToStepMap[status],
                  lastUpdated: new Date(),
                  notes: notes || request.notes,
                  isRejected: status === "rejected",
                }
              : request,
          ),
        }))
      },

      approveRequest: (id, notes) => {
        const request = get().getRequestById(id)
        if (!request) return

        const nextStep = request.currentStep + 1
        const nextStatus = stepToStatusMap[nextStep] || "validated"

        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id
              ? {
                  ...req,
                  currentStep: nextStep,
                  status: nextStatus,
                  lastUpdated: new Date(),
                  notes: notes || req.notes,
                  ...(nextStatus === "disbursed" && {
                    disbursementDate: new Date(),
                  }),
                  ...(nextStatus === "received" && { receiptDate: new Date() }),
                  ...(nextStatus === "validated" && {
                    validationDate: new Date(),
                  }),
                }
              : req,
          ),
        }))
      },

      rejectRequest: (id, rejectionReason, rejectionStep) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status: "rejected",
                  isRejected: true,
                  rejectionReason,
                  rejectionStep: rejectionStep || request.currentStep,
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
      },

      moveToNextStep: (id, notes) => {
        get().approveRequest(id, notes)
      },

      getRequestById: (id) => {
        return get().requests.find((request) => request.id === id)
      },

      getRequestsByStatus: (status) => {
        return get().requests.filter((request) => request.status === status)
      },

      updateAllocatedFunds: (id) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  allocatedFunds: request.amount,
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
      },

      addReceipt: (id, receipt) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  receipts: [...(request.receipts || []), receipt],
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
      },

      updateUtilizedFunds: (id, utilizedFunds) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  utilizedFunds,
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
      },

      addExpenseTransaction: (requestId, expense) => {
        const expenseId = `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const newExpense: ExpenseTransaction = {
          ...expense,
          id: expenseId,
          requestId,
          status: "pending",
        }

        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  expenses: [...(request.expenses || []), newExpense],
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))

        return expenseId
      },

      updateExpenseStatus: (
        requestId,
        expenseId,
        status,
        validatedBy,
        rejectionReason,
      ) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  expenses: (request.expenses || []).map((expense) =>
                    expense.id === expenseId
                      ? {
                          ...expense,
                          status,
                          validatedBy:
                            status === "validated" ? validatedBy : undefined,
                          validatedDate:
                            status === "validated" ? new Date() : undefined,
                          rejectionReason:
                            status === "rejected" ? rejectionReason : undefined,
                        }
                      : expense,
                  ),
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
      },

      getExpensesByRequestId: (requestId) => {
        const request = get().getRequestById(requestId)
        return request?.expenses || []
      },

      deleteRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((request) => request.id !== id),
        }))
      },

      deleteManyRequests: (ids) => {
        set((state) => ({
          requests: state.requests.filter(
            (request) => !ids.includes(request.id),
          ),
        }))
      },
    }),
    {
      name: "fund-request-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
