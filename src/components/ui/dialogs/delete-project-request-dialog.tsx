"use client"

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
import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { isProjectRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { format } from "date-fns"
import { AlertTriangle, Calendar } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

export const DeleteProjectRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, deleteRequest } = useProjectRequestStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "deleteProjectRequest"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleDelete = async () => {
    if (!request) return

    setIsDeleting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      deleteRequest(request.id)
      toast.success(`Project proposal ${request.id} deleted successfully`)
      onClose()
    } catch (error) {
      toast.error("Failed to delete project proposal")
    } finally {
      setIsDeleting(false)
    }
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
      <Content className={isDesktop ? "max-w-md" : ""}>
        <Header>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <Title>Delete Project Proposal</Title>
          </div>
          <Description>
            Are you sure you want to delete this project proposal? This action
            cannot be undone.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Project Details */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-red-800 text-sm">Project ID</p>
                <p className="font-mono text-red-900 text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">
                  Project Title
                </p>
                <p className="text-red-900 text-sm">{request.projectTitle}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">Project Lead</p>
                <p className="text-red-900 text-sm">{request.projectLead}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">
                  Date Submitted
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-red-600" />
                  <p className="text-red-900 text-sm">
                    {format(new Date(request.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">
                  Current Status
                </p>
                <p className="text-red-900 text-sm capitalize">
                  {request.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 text-sm">Warning</p>
                <p className="mt-1 text-amber-700 text-xs">
                  This will permanently delete the project proposal and all
                  associated data. This action cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Proposal"}
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
