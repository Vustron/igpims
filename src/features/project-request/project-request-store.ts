import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"

export interface ProjectRequest {
  id: string
  projectTitle: string
  purpose: string
  projectLead: string
  position?: string
  department: string
  status:
    | "pending"
    | "in_review"
    | "checking"
    | "approved"
    | "in_progress"
    | "completed"
    | "rejected"
  currentStep: number
  requestDate: Date
  dateNeeded?: Date
  lastUpdated: Date
  isRejected?: boolean
  rejectionStep?: number
  rejectionReason?: string
  notes?: string
  reviewerComments?: string
  projectDocument?: string
  resolutionDocument?: string
  submissionDate?: Date
  approvalDate?: Date
}

export interface DuplicateCheckResult {
  exists: boolean
  duplicateType?: "title" | "lead" | "both"
  existingProject?: ProjectRequest
}

interface ProjectRequestStore {
  requests: ProjectRequest[]
  addRequest: (
    request: Omit<
      ProjectRequest,
      "id" | "lastUpdated" | "currentStep" | "status"
    >,
  ) => string
  updateRequestStatus: (
    id: string,
    status: ProjectRequest["status"],
    notes?: string,
  ) => void
  approveRequest: (id: string, notes?: string) => void
  rejectRequest: (
    id: string,
    rejectionReason: string,
    rejectionStep?: number,
  ) => void
  moveToNextStep: (id: string, notes?: string) => void
  getRequestById: (id: string) => ProjectRequest | undefined
  getRequestsByStatus: (status: ProjectRequest["status"]) => ProjectRequest[]
  addResolutionDocument: (id: string, document: string) => void
  deleteRequest: (id: string) => void
  deleteManyRequests: (ids: string[]) => void
  checkForDuplicates: (
    projectTitle: string,
    projectLead: string,
  ) => DuplicateCheckResult
  validateProjectCreation: (
    projectTitle: string,
    projectLead: string,
  ) => {
    isValid: boolean
    error?: string
    duplicateInfo?: DuplicateCheckResult
  }
}

const statusToStepMap: Record<ProjectRequest["status"], number> = {
  pending: 1,
  in_review: 2,
  checking: 3,
  approved: 4,
  in_progress: 5,
  completed: 6,
  rejected: 0,
}

const stepToStatusMap: Record<number, ProjectRequest["status"]> = {
  1: "pending",
  2: "in_review",
  3: "checking",
  4: "approved",
  5: "in_progress",
  6: "completed",
}

export const useProjectRequestStore = create<ProjectRequestStore>()(
  persist(
    (set, get) => ({
      requests: [],

      checkForDuplicates: (projectTitle, projectLead) => {
        const requests = get().requests

        // Only check active requests (not rejected or completed)
        const activeRequests = requests.filter(
          (request) =>
            request.status !== "rejected" && request.status !== "completed",
        )

        // Check for exact title match
        const titleMatch = activeRequests.find(
          (request) =>
            request.projectTitle.toLowerCase().trim() ===
            projectTitle.toLowerCase().trim(),
        )

        // Check for same project lead with active projects
        const leadMatch = activeRequests.find(
          (request) =>
            request.projectLead.toLowerCase().trim() ===
            projectLead.toLowerCase().trim(),
        )

        if (titleMatch && leadMatch && titleMatch.id === leadMatch.id) {
          return {
            exists: true,
            duplicateType: "both",
            existingProject: titleMatch,
          }
        }

        if (titleMatch) {
          return {
            exists: true,
            duplicateType: "title",
            existingProject: titleMatch,
          }
        }

        if (leadMatch) {
          return {
            exists: true,
            duplicateType: "lead",
            existingProject: leadMatch,
          }
        }

        return { exists: false }
      },

      validateProjectCreation: (projectTitle, projectLead) => {
        const duplicateCheck = get().checkForDuplicates(
          projectTitle,
          projectLead,
        )

        if (!duplicateCheck.exists) {
          return { isValid: true }
        }

        let error = ""
        switch (duplicateCheck.duplicateType) {
          case "title":
            error = `A project with the title "${projectTitle}" already exists (ID: ${duplicateCheck.existingProject?.id})`
            break
          case "lead":
            error = `${projectLead} already has an active project proposal (ID: ${duplicateCheck.existingProject?.id})`
            break
          case "both":
            error = `This exact project already exists (ID: ${duplicateCheck.existingProject?.id})`
            break
        }

        return {
          isValid: false,
          error,
          duplicateInfo: duplicateCheck,
        }
      },

      addRequest: (requestData) => {
        // Check for duplicates before creating
        const validation = get().validateProjectCreation(
          requestData.projectTitle,
          requestData.projectLead,
        )

        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        const newRequest: ProjectRequest = {
          ...requestData,
          id: `IGP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
          requestDate: new Date(),
          lastUpdated: new Date(),
          currentStep: 1,
          status: "pending",
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
        const nextStatus = stepToStatusMap[nextStep] || "completed"

        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === id
              ? {
                  ...req,
                  currentStep: nextStep,
                  status: nextStatus,
                  lastUpdated: new Date(),
                  notes: notes || req.notes,
                  ...(nextStatus === "approved" && {
                    approvalDate: new Date(),
                  }),
                  ...(nextStatus === "completed" && {
                    submissionDate: new Date(),
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

      addResolutionDocument: (id, document) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  resolutionDocument: document,
                  lastUpdated: new Date(),
                }
              : request,
          ),
        }))
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
      name: "project-request-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
