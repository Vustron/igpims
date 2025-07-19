"use client"

import { useUpdateIgp } from "@/backend/actions/igp/update-igp"
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
import { isIgpData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const CompleteProjectDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [igpId, setIgpId] = useState("")

  useEffect(() => {
    if (isIgpData(data) && data.igp) {
      setIgpId(data.igp.id)
    }
  }, [data])

  const updateIgp = useUpdateIgp(igpId)

  const isDialogOpen = isOpen && type === "completeProject" && igpId !== ""

  if (!isDialogOpen) {
    return null
  }

  if (!isIgpData(data) || !data.igp) {
    return null
  }

  const handleCompleteProject = async () => {
    await toast.promise(
      updateIgp.mutateAsync({
        status: "completed",
        currentStep: 6,
      }),
      {
        loading: "Completing project...",
        success: "Project marked as completed successfully",
        error: (error) => catchError(error),
      },
    )
    onClose()
  }

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
            <CheckCircle className="h-5 w-5 text-green-600" />
            <Title>Mark Project preparation as Completed</Title>
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
                  {data.igp.id}
                </p>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-sm">
                  Project Lead
                </p>
                <p className="text-emerald-900 text-sm">
                  {data.igp.projectLeadData?.name}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-emerald-800 text-sm">
                  Project Title
                </p>
                <p className="font-semibold text-emerald-900 text-sm">
                  {data.igp.igpName}
                </p>
              </div>
            </div>
          </div>

          {data.igp.projectDocument && (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Project Document
              </span>
              <PDFViewer file={data.igp.projectDocument} />
            </div>
          )}

          {data.igp.resolutionDocument && (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Committee Resolution
              </span>
              <PDFViewer file={data.igp.resolutionDocument} />
            </div>
          )}

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
            disabled={updateIgp.isPending}
          >
            {updateIgp.isPending ? "Processing..." : "Mark as Completed"}
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
