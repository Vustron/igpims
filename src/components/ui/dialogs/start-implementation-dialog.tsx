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
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { Calendar, Play } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const StartImplementationDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [igpId, setIgpId] = useState("")

  useEffect(() => {
    if (isIgpData(data) && data.igp) {
      setIgpId(data.igp.id)
    }
  }, [data])

  const updateIgp = useUpdateIgp(igpId)

  const isDialogOpen = isOpen && type === "startImplementation" && igpId !== ""

  if (!isDialogOpen) {
    return null
  }

  if (!isIgpData(data) || !data.igp) {
    return null
  }

  const handleStartImplementation = async () => {
    await toast.promise(
      updateIgp.mutateAsync({
        status: "in_progress",
        currentStep: 5,
        approvalDate: new Date().setHours(0, 0, 0, 0),
      }),
      {
        loading: "Starting implementation...",
        success: "Implementation started successfully",
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
                <p className="font-mono text-indigo-900 text-sm">{igpId}</p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Project Lead
                </p>
                <p className="text-indigo-900 text-sm">
                  {data.igp.projectLead}
                </p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Department
                </p>
                <p className="text-indigo-900 text-sm">{data.igp.department}</p>
              </div>
              <div>
                <p className="font-medium text-indigo-800 text-sm">
                  Approval Date
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-indigo-600" />
                  <p className="text-indigo-900 text-sm">
                    {formatDateFromTimestamp(data.igp.approvalDate)}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-indigo-800 text-sm">
                  Project Title
                </p>
                <p className="font-semibold text-indigo-900 text-sm">
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
            disabled={updateIgp.isPending}
          >
            {updateIgp.isPending ? "Processing..." : "Start Implementation"}
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
