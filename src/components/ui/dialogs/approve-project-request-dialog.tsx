"use client"

import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { Textarea } from "@/components/ui/inputs"
import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { isProjectRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const ApproveProjectRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest, rejectRequest } =
    useProjectRequestStore()
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "approveProjectRequest"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleApprove = () => {
    if (request) {
      approveRequest(request.id, approvalNotes)
      onClose()
      resetForm()
    }
  }

  const handleReject = () => {
    if (request && rejectionReason.trim()) {
      rejectRequest(request.id, rejectionReason, 4)
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setApprovalNotes("")
    setRejectionReason("")
    setIsRejecting(false)
  }

  if (!request) return null

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={isDesktop ? "h-[90vh] max-w-2xl overflow-y-auto" : ""}
      >
        <Header>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <Title>Approve Project Implementation</Title>
          </div>
          <Description>
            Final approval for project implementation. This will authorize the
            project to begin.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Project Details */}
          <div className="rounded-lg border bg-emerald-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-emerald-800 text-sm">
                  Project ID
                </p>
                <p className="font-mono text-emerald-900 text-sm">
                  {request.id}
                </p>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-sm">
                  Project Lead
                </p>
                <p className="text-emerald-900 text-sm">
                  {request.projectLead}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-emerald-800 text-sm">
                  Project Title
                </p>
                <p className="font-semibold text-emerald-900 text-sm">
                  {request.projectTitle}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mb-2 font-medium text-emerald-800 text-sm">
                  Project Details
                </p>
                <div className="space-y-3 rounded-md bg-white p-3 text-emerald-900 text-sm">
                  {/* Parse and format the purpose */}
                  {(() => {
                    const purpose = request.purpose
                    const lines = purpose
                      .split("\n")
                      .filter((line) => line.trim())

                    // Extract the main description (first line)
                    const mainDescription = lines[0]

                    // Find project details section
                    const detailsStartIndex = lines.findIndex((line) =>
                      line.includes("Project Details:"),
                    )
                    const conclusionStartIndex = lines.findIndex((line) =>
                      line.includes("This IGP aims"),
                    )

                    // Extract project details
                    const projectDetails =
                      detailsStartIndex !== -1
                        ? lines
                            .slice(
                              detailsStartIndex + 1,
                              conclusionStartIndex !== -1
                                ? conclusionStartIndex
                                : undefined,
                            )
                            .filter((line) => line.trim().startsWith("-"))
                            .map((line) => line.trim())
                        : []

                    // Extract conclusion
                    const conclusion =
                      conclusionStartIndex !== -1
                        ? lines[conclusionStartIndex]
                        : ""

                    return (
                      <div className="space-y-3">
                        {/* Main Description */}
                        <div className="border-emerald-200 border-b pb-2">
                          <p className="font-medium text-emerald-900">
                            {mainDescription}
                          </p>
                        </div>

                        {/* Project Details */}
                        {projectDetails.length > 0 && (
                          <div>
                            <p className="mb-2 font-medium text-emerald-800 text-xs">
                              PROJECT DETAILS:
                            </p>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              {projectDetails.map((detail, index) => {
                                const [label, value] = detail
                                  .split(":")
                                  .map((s) => s.trim())
                                const cleanLabel = label?.replace("- ", "")

                                return (
                                  <div
                                    key={index}
                                    className="flex items-start justify-between rounded border border-emerald-100 bg-emerald-50 p-2"
                                  >
                                    <span className="font-medium text-emerald-700 text-xs">
                                      {cleanLabel}:
                                    </span>
                                    <span className="ml-2 text-right text-emerald-900 text-xs">
                                      {value}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Conclusion */}
                        {conclusion && (
                          <div className="border-emerald-200 border-t pt-2">
                            <p className="text-emerald-800 text-xs italic">
                              {conclusion}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Approval/Rejection Notes */}
          {!isRejecting ? (
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Approval Notes (Optional)
              </span>
              <Textarea
                placeholder="Add any notes or conditions for this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
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
                Reject Project
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Project Implementation
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
                Reject Project
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
