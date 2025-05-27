"use client"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs/dialog"
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import {
  FileSearch,
  Calendar,
  Target,
  Clock,
  Users,
  DollarSign,
} from "lucide-react"
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { isProjectRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

import { format } from "date-fns"

export const ReviewProjectRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest, rejectRequest } =
    useProjectRequestStore()
  const [reviewComments, setReviewComments] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "reviewProjectRequest"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleApprove = () => {
    if (request) {
      approveRequest(request.id, reviewComments)
      onClose()
      resetForm()
    }
  }

  const handleReject = () => {
    if (request && rejectionReason.trim()) {
      rejectRequest(request.id, rejectionReason, 2)
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setReviewComments("")
    setRejectionReason("")
    setIsRejecting(false)
  }

  // Function to parse and format the purpose text
  const parsePurpose = (purpose: string) => {
    const lines = purpose.split("\n").filter((line) => line.trim())

    // Extract main description (first line)
    const mainDescription = lines[0]?.trim() || ""

    // Extract project details section
    const projectDetailsStart = lines.findIndex((line) =>
      line.includes("Project Details:"),
    )
    const projectDetailsEnd = lines.findIndex((line) =>
      line.includes("This IGP aims"),
    )

    let projectDetails: Array<{ label: string; value: string; icon?: any }> = []

    if (projectDetailsStart !== -1) {
      const detailLines = lines.slice(
        projectDetailsStart + 1,
        projectDetailsEnd !== -1 ? projectDetailsEnd : undefined,
      )

      projectDetails = detailLines
        .filter((line) => line.includes("- ") && line.includes(":"))
        .map((line) => {
          const cleanLine = line.replace("- ", "").trim()
          const [label, ...valueParts] = cleanLine.split(":")
          const value = valueParts.join(":").trim()

          // Add icons based on the label
          let icon = null
          if (label?.toLowerCase().includes("type")) icon = Target
          if (label?.toLowerCase().includes("period")) icon = Calendar
          if (label?.toLowerCase().includes("quantities")) icon = Users
          if (
            label?.toLowerCase().includes("budget") ||
            label?.toLowerCase().includes("cost")
          )
            icon = DollarSign
          if (label?.toLowerCase().includes("officers")) icon = Users
          if (label?.toLowerCase().includes("implementation")) icon = Clock

          return { label: label?.trim() || "", value, icon }
        })
        .filter((item) => item.label !== "")
    }

    const conclusion =
      lines.find((line) => line.includes("This IGP aims"))?.trim() || ""

    return { mainDescription, projectDetails, conclusion }
  }

  if (!request) return null

  const { mainDescription, projectDetails, conclusion } = parsePurpose(
    request.purpose,
  )

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={isDesktop ? "max-h-[95vh] max-w-4xl overflow-y-auto" : ""}
      >
        <Header>
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-blue-600" />
            <Title>Review IGP Project Request</Title>
          </div>
          <Description>
            Review the project proposal details and decide whether to approve or
            reject.
          </Description>
        </Header>

        <div className="space-y-6">
          {/* Request Overview */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-800 text-sm">
              Request Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-sm">Request ID</p>
                <p className="font-mono text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Project Title
                </p>
                <p className="text-sm">{request.projectTitle}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Project Lead
                </p>
                <p className="text-sm">{request.projectLead}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Department</p>
                <p className="text-sm">{request.department}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Date Requested
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {format(new Date(request.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {request.dateNeeded
                      ? format(new Date(request.dateNeeded), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Purpose & Details */}
          <div className="rounded-lg border bg-blue-50/30 p-4">
            <h3 className="mb-3 font-semibold text-blue-800 text-sm">
              Project Purpose & Details
            </h3>

            {/* Main Description */}
            {mainDescription && (
              <div className="mb-4">
                <p className="text-blue-900 text-sm leading-relaxed">
                  {mainDescription}
                </p>
              </div>
            )}

            {/* Project Details Grid */}
            {projectDetails.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-3 font-medium text-blue-800 text-sm">
                  Project Specifications
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {projectDetails.map((detail, index) => {
                    const IconComponent = detail.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded-md bg-white/60 p-3"
                      >
                        {IconComponent && (
                          <IconComponent className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-blue-800 text-xs">
                            {detail.label}
                          </p>
                          <p className="text-blue-900 text-sm">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Conclusion */}
            {conclusion && (
              <div className="rounded-md bg-blue-100/50 p-3">
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 text-xs">
                      Project Objective
                    </p>
                    <p className="text-blue-900 text-sm">{conclusion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Comments */}
          {!isRejecting ? (
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Review Comments (Optional)
              </span>
              <Textarea
                placeholder="Add any comments about this review..."
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div>
              <span className="mb-2 block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(true)}>
                Reject Request
              </Button>
              <Button onClick={handleApprove}>
                Approve & Create Resolution
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
