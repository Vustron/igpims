"use client"

import { ScrollText } from "lucide-react"
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

export const CreateResolutionDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest, rejectRequest } =
    useProjectRequestStore()
  const [resolutionContent, setResolutionContent] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "createResolution"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleCreateResolution = () => {
    if (request && resolutionContent.trim()) {
      approveRequest(request.id, resolutionContent)
      onClose()
      resetForm()
    }
  }

  const handleReject = () => {
    if (request && rejectionReason.trim()) {
      rejectRequest(request.id, rejectionReason, 3)
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setResolutionContent("")
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
      <Content className={isDesktop ? "max-w-3xl" : ""}>
        <Header>
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-purple-600" />
            <Title>Create Committee Resolution</Title>
          </div>
          <Description>
            Draft the official committee resolution for this IGP project
            proposal.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Project Summary */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900 text-sm">
              Project Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-xs">Project ID</p>
                <p className="font-mono text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-xs">
                  Project Lead
                </p>
                <p className="text-sm">{request.projectLead}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-600 text-xs">
                  Project Title
                </p>
                <p className="font-medium text-sm">{request.projectTitle}</p>
              </div>
            </div>
          </div>

          {/* Resolution Content */}
          {!isRejecting ? (
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Resolution Content *
              </span>
              <Textarea
                placeholder="WHEREAS, the committee has reviewed the IGP project proposal...&#10;&#10;NOW THEREFORE, BE IT RESOLVED that..."
                value={resolutionContent}
                onChange={(e) => setResolutionContent(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="mt-1 text-gray-500 text-xs">
                Draft the official committee resolution approving this project
                proposal.
              </p>
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
                rows={4}
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(true)}>
                Reject Proposal
              </Button>
              <Button
                onClick={handleCreateResolution}
                disabled={!resolutionContent.trim()}
              >
                Create Resolution & Submit
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
                Reject Proposal
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
