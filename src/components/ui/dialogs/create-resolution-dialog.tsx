"use client"

import { useUpdateIgp } from "@/backend/actions/igp/update-igp"
import { getImagekitUploadAuth } from "@/backend/actions/imagekit-api/upload-auth"
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
import { upload } from "@imagekit/next"
import { FileText, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const CreateResolutionDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [isRejecting, setIsRejecting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [igpId, setIgpId] = useState("")

  useEffect(() => {
    if (isIgpData(data) && data.igp) {
      setIgpId(data.igp.id)
    }
  }, [data])

  const updateIgp = useUpdateIgp(igpId)

  const isDialogOpen = isOpen && type === "createResolution" && igpId !== ""

  if (!isDialogOpen) {
    return null
  }

  if (!isIgpData(data) || !data.igp) {
    return null
  }

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      const url = URL.createObjectURL(file)
      setPdfPreviewUrl(url)
    }
  }

  const removePdf = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl)
    }
    setPdfFile(null)
    setPdfPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadPdfToImageKit = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const authParams = await getImagekitUploadAuth()
      const { signature, expire, token, publicKey } = authParams

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: `resolution_document_${Date.now()}.pdf`,
        folder: "/igpmis/",
        useUniqueFileName: true,
      })

      if (!uploadResponse.url) {
        throw new Error("Upload did not return a file URL.")
      }

      return uploadResponse.url
    } catch (error) {
      toast.error("Failed to upload PDF document")
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateResolution = async () => {
    if (!data.igp || !pdfFile) return

    const resolutionDocumentUrl = await uploadPdfToImageKit(pdfFile)

    await toast.promise(
      updateIgp.mutateAsync({
        status: "checking",
        resolutionDocument: resolutionDocumentUrl,
        currentStep: 3,
      }),
      {
        loading: "Creating resolution...",
        success: "Resolution created successfully",
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
        rejectionStep: 3,
      }),
      {
        loading: "Rejecting proposal...",
        success: "Proposal rejected successfully",
        error: (error) => catchError(error),
      },
    )
    onClose()
    resetForm()
  }

  const resetForm = () => {
    removePdf()
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
            <FileText className="h-5 w-5 text-purple-600" />
            <Title>Create Committee Resolution</Title>
          </div>
          <Description>
            Upload the official committee resolution document for this IGP
            project proposal.
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
                <p className="font-mono text-sm">{data.igp.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-xs">
                  Project Lead
                </p>
                <p className="text-sm">{data.igp.projectLeadData?.name}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-600 text-xs">
                  Project Title
                </p>
                <p className="font-medium text-sm">{data.igp.igpName}</p>
              </div>
            </div>
          </div>

          {/* Resolution Document Upload */}
          {!isRejecting ? (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Resolution Document (PDF) *
              </span>
              {!pdfPreviewUrl ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-600">
                    Upload resolution document PDF
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || updateIgp.isPending}
                  >
                    {isUploading ? "Uploading..." : "Select PDF File"}
                  </Button>
                  <p className="mt-2 text-xs text-gray-500">
                    Only PDF files are accepted
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">
                        {pdfFile?.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePdf}
                      className="text-red-600 hover:text-red-700"
                      disabled={isUploading || updateIgp.isPending}
                    >
                      Remove
                    </Button>
                  </div>

                  {pdfPreviewUrl && <PDFViewer file={pdfPreviewUrl} />}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block font-medium text-red-700 text-sm">
                Confirm Rejection
              </span>
              <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to reject this proposal? This action
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
                disabled={isUploading || updateIgp.isPending}
              >
                Reject Proposal
              </Button>
              <Button
                onClick={handleCreateResolution}
                disabled={!pdfFile || isUploading || updateIgp.isPending}
              >
                {isUploading ? "Uploading..." : "Submit Resolution Document"}
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
