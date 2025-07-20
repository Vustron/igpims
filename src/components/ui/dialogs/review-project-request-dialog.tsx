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
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { upload } from "@imagekit/next"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Calendar, FileSearch, FileText, Upload } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { TiptapEditorControls } from "../text-editor/tiptap-controls"

const PDFViewer = dynamic(
  () => import("@/components/ui/pdf/pdf-viewer").then((mod) => mod.PDFViewer),
  { ssr: false },
)

export const ReviewProjectRequestDialog = () => {
  const { type, isOpen, onClose, data } = useDialog()
  const [isRejecting, setIsRejecting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [igpId, setIgpId] = useState("")

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  })

  const rejectionEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
  })

  useEffect(() => {
    if (isIgpData(data) && data.igp) {
      setIgpId(data.igp.id)
    }
  }, [data])

  const updateIgp = useUpdateIgp(igpId)

  const isDialogOpen = isOpen && type === "reviewProjectRequest" && igpId !== ""

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
        folder: "/igpmis/",
        fileName: `project_doc_${Date.now()}.pdf`,
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

  const handleApprove = async () => {
    if (!data.igp) return

    let projectDocumentUrl = data.igp.projectDocument

    if (pdfFile) {
      projectDocumentUrl = await uploadPdfToImageKit(pdfFile)
    }

    await toast.promise(
      updateIgp.mutateAsync({
        status: "in_review",
        reviewerComments: editor?.getHTML(),
        projectDocument: projectDocumentUrl,
        currentStep: 2,
      }),
      {
        loading: <span className="animate-pulse">Confirming review...</span>,
        success: "Successfully confirmed review",
        error: (error: unknown) => catchError(error),
      },
    )

    onClose()
    resetForm()
  }

  const handleReject = async () => {
    if (!data.igp || !rejectionEditor?.getText().trim()) return

    await toast.promise(
      updateIgp.mutateAsync({
        status: "rejected",
        rejectionReason: rejectionEditor.getHTML(),
        isRejected: true,
        rejectionStep: 2,
      }),
      {
        loading: <span className="animate-pulse">Rejecting review...</span>,
        success: "Successfully rejected review",
        error: (error: unknown) => catchError(error),
      },
    )

    onClose()
    resetForm()
  }

  const resetForm = () => {
    editor?.commands.clearContent()
    rejectionEditor?.commands.clearContent()
    setIsRejecting(false)
    removePdf()
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
            <FileSearch className="h-5 w-5 text-blue-600" />
            <Title>Review IGP Project Request</Title>
          </div>
          <Description>
            Review the project proposal details and decide whether to approve or
            reject.
          </Description>
        </Header>

        <div className="space-y-6">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-800 text-sm">
              Request Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-sm">Request ID</p>
                <p className="font-mono text-sm">{data.igp.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Project Title
                </p>
                <p className="text-sm">{data.igp.igpName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Project Lead
                </p>
                <p className="text-sm">{data.igp.projectLeadData?.name}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Description</p>
                <p className="text-sm">{data.igp.igpDescription}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Date Requested
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {formatDateFromTimestamp(data.igp.requestDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {data.igp.dateNeeded
                      ? formatDateFromTimestamp(data.igp.dateNeeded)
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-blue-50/30 p-4">
            <h3 className="mb-3 font-semibold text-blue-800 text-sm">
              Project Purpose & Details
            </h3>

            {!pdfPreviewUrl ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600">
                  Upload project documentation PDF
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
                    <span className="text-sm font-medium">{pdfFile?.name}</span>
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

          {!isRejecting ? (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Review Comments (Optional)
              </span>
              <div className="rounded-lg border bg-white p-2">
                <TiptapEditorControls editor={editor} />
                <div className="mt-2 rounded border p-2">
                  <EditorContent editor={editor} className="min-h-[100px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <div className="rounded-lg border bg-white p-2">
                <TiptapEditorControls editor={rejectionEditor} />
                <div className="mt-2 rounded border border-red-300 p-2 focus-within:border-red-500 focus-within:ring-red-500">
                  <EditorContent
                    editor={rejectionEditor}
                    className="min-h-[100px]"
                  />
                </div>
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
                Reject Request
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isUploading || updateIgp.isPending}
              >
                {isUploading ? "Uploading..." : "Approve & Create Resolution"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={isUploading || updateIgp.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={
                  rejectionEditor?.isEmpty || isUploading || updateIgp.isPending
                }
              >
                Reject Request
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
