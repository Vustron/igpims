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
import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const ApproveProjectRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [igpId, setIgpId] = useState("")

  useEffect(() => {
    if (isIgpData(data) && data.igp) {
      setIgpId(data.igp.id)
    }
  }, [data])

  const updateIgp = useUpdateIgp(igpId)

  const isDialogOpen =
    isOpen && type === "approveProjectRequest" && igpId !== ""

  if (!isDialogOpen) {
    return null
  }

  if (!isIgpData(data) || !data.igp) {
    return null
  }

  const handleApprove = async () => {
    await toast.promise(
      updateIgp.mutateAsync({
        status: "approved",
        currentStep: 4,
      }),
      {
        loading: "Approving project...",
        success: "Project approved successfully",
        error: (error) => catchError(error),
      },
    )
    onClose()
    resetForm()
  }

  const handleReject = async () => {
    if (!data.igp) return

    await toast.promise(
      updateIgp.mutateAsync({
        status: "rejected",
        isRejected: true,
        rejectionStep: 4,
      }),
      {
        loading: "Rejecting project...",
        success: "Project rejected successfully",
        error: (error) => catchError(error),
      },
    )
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setIsRejecting(false)
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
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <Title>Approve Project Implementation</Title>
          </div>
          <Description>
            Check the submmited documents for this IGP project.
          </Description>
        </Header>

        <div className="space-y-4">
          <div className="rounded-lg border bg-emerald-50 p-4">
            <h3 className="mb-2 font-medium text-emerald-900 text-sm">
              Project Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-emerald-800 text-xs">
                  Project ID
                </p>
                <p className="font-mono text-sm">{data.igp.id}</p>
              </div>
              <div>
                <p className="font-medium text-emerald-800 text-xs">
                  Project Lead
                </p>
                <p className="text-sm">{data.igp.projectLeadData?.name}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-emerald-800 text-xs">
                  Project Title
                </p>
                <p className="font-medium text-sm">{data.igp.igpName}</p>
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

          {isRejecting && (
            <div className="space-y-2">
              <span className="block font-medium text-red-700 text-sm">
                Confirm Rejection
              </span>
              <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to reject this project? This action
                  cannot be undone.
                </p>
              </div>
            </div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRejecting(true)}
                disabled={updateIgp.isPending}
              >
                Reject Project
              </Button>
              <Button
                onClick={handleApprove}
                disabled={updateIgp.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Project
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={updateIgp.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={updateIgp.isPending}
              >
                {updateIgp.isPending ? "Processing..." : "Confirm Rejection"}
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
