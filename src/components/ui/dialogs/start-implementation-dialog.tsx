"use client"

import { format } from "date-fns"
import { Calendar, Play } from "lucide-react"
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

export const StartImplementationDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest } = useProjectRequestStore()
  const [implementationNotes, setImplementationNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "startImplementation"
  const request =
    isProjectRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleStartImplementation = () => {
    if (request) {
      approveRequest(request.id, implementationNotes)
      onClose()
      setImplementationNotes("")
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
            <Play className="h-5 w-5 text-indigo-600" />
            <Title>Start Project Implementation</Title>
          </div>
          <Description>
            Begin the implementation phase of this approved IGP project.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Project Details */}
          <div className="rounded-lg border bg-indigo-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Project ID
                </p>
                <p className="font-mono text-indigo-900 text-sm">
                  {request.id}
                </p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Project Lead
                </p>
                <p className="text-indigo-900 text-sm">{request.projectLead}</p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Department
                </p>
                <p className="text-indigo-900 text-sm">{request.department}</p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Approval Date
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-indigo-600" />
                  <p className="text-indigo-900 text-sm">
                    {request.approvalDate
                      ? format(new Date(request.approvalDate), "MMM d, yyyy")
                      : format(new Date(), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-indigo-800 text-sm">
                  Project Title
                </p>
                <p className="font-semibold text-indigo-900 text-sm">
                  {request.projectTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Notes */}
          <div>
            <span className="mb-2 block font-medium text-gray-700 text-sm">
              Implementation Notes (Optional)
            </span>
            <Textarea
              placeholder="Add any notes about starting the implementation..."
              value={implementationNotes}
              onChange={(e) => setImplementationNotes(e.target.value)}
              rows={4}
            />
            <p className="mt-1 text-gray-500 text-xs">
              Record any important information about the implementation start.
            </p>
          </div>

          {/* Implementation Checklist */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900 text-sm">
              Implementation Checklist
            </h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• Project team has been notified</li>
              <li>• Required resources have been allocated</li>
              <li>• Implementation timeline has been established</li>
              <li>• Regular progress monitoring will begin</li>
            </ul>
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleStartImplementation}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Start Implementation
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
