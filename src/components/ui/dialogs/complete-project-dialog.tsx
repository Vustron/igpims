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
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"
import { CheckCircle, Calendar } from "lucide-react"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { isProjectRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

import { format } from "date-fns"

export const CompleteProjectDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest } = useProjectRequestStore()
  const [completionNotes, setCompletionNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "completeProject"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleCompleteProject = () => {
    if (request) {
      approveRequest(request.id, completionNotes)
      onClose()
      setCompletionNotes("")
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
      <Content
        className={isDesktop ? "h-[90vh] max-w-2xl overflow-y-auto" : ""}
      >
        <Header>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <Title>Mark Project as Completed</Title>
          </div>
          <Description>
            Mark this IGP project as successfully completed and finalize the
            implementation.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Project Summary */}
          <div className="rounded-lg border bg-green-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-800 text-sm">Project ID</p>
                <p className="font-mono text-green-900 text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-green-800 text-sm">
                  Project Lead
                </p>
                <p className="text-green-900 text-sm">{request.projectLead}</p>
              </div>
              <div>
                <p className="font-medium text-green-800 text-sm">Department</p>
                <p className="text-green-900 text-sm">{request.department}</p>
              </div>
              <div>
                <p className="font-medium text-green-800 text-sm">Start Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-green-600" />
                  <p className="text-green-900 text-sm">
                    {format(new Date(request.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-green-800 text-sm">
                  Project Title
                </p>
                <p className="font-semibold text-green-900 text-sm">
                  {request.projectTitle}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-green-800 text-sm">Purpose</p>
                <p className="text-green-900 text-sm">{request.purpose}</p>
              </div>
            </div>
          </div>

          {/* Completion Notes */}
          <div>
            <span className="mb-2 block font-medium text-gray-700 text-sm">
              Project Completion Summary
            </span>
            <Textarea
              placeholder="Provide a summary of project outcomes, achievements, and any final notes..."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={5}
            />
            <p className="mt-1 text-gray-500 text-xs">
              Document the project results and any important completion details.
            </p>
          </div>

          {/* Completion Checklist */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900 text-sm">
              Completion Verification
            </h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• All project deliverables have been completed</li>
              <li>• Project outcomes have been documented</li>
              <li>• Stakeholders have been notified of completion</li>
              <li>• Final project report has been prepared</li>
              <li>• Project resources have been properly closed out</li>
            </ul>
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCompleteProject}
            className="bg-green-600 hover:bg-green-700"
          >
            Mark as Completed
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
