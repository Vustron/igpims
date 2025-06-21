"use client"

import { CheckCircle } from "lucide-react"
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
