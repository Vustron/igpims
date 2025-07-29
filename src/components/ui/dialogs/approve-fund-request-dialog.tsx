"use client"

import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { useUpdateFundRequest } from "@/backend/actions/fund-request/update-fund-request"
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
import { Textarea } from "@/components/ui/inputs"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { formatCurrency } from "@/utils/currency"
import { upload } from "@imagekit/next"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const ApproveFundRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [digitalSignature, setDigitalSignature] = useState<
    File | string | null
  >(null)
  const [auditCertification, setAuditCertification] = useState<
    File | string | null
  >(null)
  const [uploadProgress, setUploadProgress] = useState<{
    signature: number
    audit: number
  }>({ signature: 0, audit: 0 })
  const [isUploading, setIsUploading] = useState<{
    signature: boolean
    audit: boolean
  }>({ signature: false, audit: false })
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest, isPending } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const uploadFileToImageKit = async (
    file: File,
    type: "signature" | "audit",
  ): Promise<string> => {
    setIsUploading((prev) => ({ ...prev, [type]: true }))
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }))

    try {
      const authParams = await getImagekitUploadAuth()
      const { signature, expire, token, publicKey } = authParams

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: `fund_request_${fundRequest?.id}_${type}_${Date.now()}`,
        folder: "/igpmis/",
        useUniqueFileName: true,
        onProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress((prev) => ({ ...prev, [type]: percent }))
        },
      })

      if (!uploadResponse.url) {
        throw new Error("Upload did not return a file URL.")
      }

      return uploadResponse.url
    } catch (error) {
      toast.error(
        `Failed to upload ${type === "signature" ? "signature" : "certification"}`,
      )
      throw error
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "signature" | "audit",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadFileToImageKit(file, type)
      if (type === "signature") {
        setDigitalSignature(url)
      } else {
        setAuditCertification(url)
      }
    } catch (error) {
      catchError(error)
    }
  }

  const handleApprove = async () => {
    try {
      if (!digitalSignature || !auditCertification) {
        throw new Error(
          "Both digital signature and audit certification are required",
        )
      }

      await toast.promise(
        updateRequest({
          status: "approved",
          notes: approvalNotes,
          currentStep: 5,
          digitalSignature:
            typeof digitalSignature === "string" ? digitalSignature : "",
          auditCertification:
            typeof auditCertification === "string" ? auditCertification : "",
        }),
        {
          loading: "Approving fund release...",
          success: "Funds released successfully",
          error: (error) => catchError(error),
        },
      )
      onClose()
      resetForm()
    } catch (error) {
      catchError(error)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) return

    try {
      await toast.promise(
        updateRequest({
          status: "rejected",
          isRejected: true,
          rejectionReason,
          rejectionStep: 4,
          currentStep: 4,
        }),
        {
          loading: "Rejecting fund release...",
          success: "Fund release rejected",
          error: (error) => catchError(error),
        },
      )
      onClose()
      resetForm()
    } catch (error) {
      catchError(error)
    }
  }

  const resetForm = () => {
    setApprovalNotes("")
    setRejectionReason("")
    setIsRejecting(false)
    setDigitalSignature(null)
    setAuditCertification(null)
    setUploadProgress({ signature: 0, audit: 0 })
    setIsUploading({ signature: false, audit: false })
  }

  const isDialogOpen = isOpen && type === "approveFundRequest"

  if (!isDialogOpen || !fundRequest) return null

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  const isSubmitDisabled =
    !isRejecting &&
    (!digitalSignature ||
      !auditCertification ||
      isUploading.signature ||
      isUploading.audit)

  const renderFilePreview = (
    file: File | string | null,
    type: "signature" | "audit",
  ) => {
    if (!file) return null

    const url = typeof file === "string" ? file : URL.createObjectURL(file)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-2 border rounded-lg overflow-hidden bg-gray-50"
      >
        {type === "audit" ? (
          <div className="h-[400px] w-full">
            <PDFViewer file={url} />
          </div>
        ) : (
          <div className="relative h-40 w-full">
            <Image
              src={url}
              alt="Digital Signature"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        <div className="p-2 border-t flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            {type === "audit" ? (
              <>
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-xs text-gray-700">
                  Audit Certification - PDF
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-700">
                  Digital Signature - Image
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              type === "signature"
                ? setDigitalSignature(null)
                : setAuditCertification(null)
            }
            className="text-red-500 hover:text-red-700 text-xs font-medium"
          >
            Remove
          </button>
        </div>
      </motion.div>
    )
  }

  const renderUploadArea = (type: "signature" | "audit") => {
    const isUploadingFile =
      type === "signature" ? isUploading.signature : isUploading.audit
    const progress =
      type === "signature" ? uploadProgress.signature : uploadProgress.audit
    const file = type === "signature" ? digitalSignature : auditCertification

    if (file) {
      return renderFilePreview(file, type)
    }

    return (
      <motion.label
        whileHover={isUploadingFile ? {} : { scale: 1.02 }}
        whileTap={isUploadingFile ? {} : { scale: 0.98 }}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isUploadingFile
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        {isUploadingFile ? (
          <div className="flex flex-col items-center justify-center w-full p-4 space-y-2">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">Uploading... {progress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {type === "signature" ? (
              <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
            ) : (
              <FileText className="w-8 h-8 mb-3 text-gray-400" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              Click to upload{" "}
              {type === "signature" ? "signature" : "certification"}
            </p>
            <p className="text-xs text-gray-500">
              {type === "signature" ? "PNG, JPG" : "PDF"}
            </p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept={type === "signature" ? "image/*" : ".pdf"}
          onChange={(e) => handleFileChange(e, type)}
          disabled={isUploadingFile}
        />
      </motion.label>
    )
  }

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={isDesktop ? "max-h-[95vh] max-w-4xl overflow-y-auto" : ""}
      >
        <Header>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <Title>Approve Fund Release</Title>
          </div>
          <Description>
            Final approval for fund release. This will authorize the
            disbursement.
          </Description>
        </Header>

        <div className="p-6 space-y-4">
          {/* Request Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border bg-emerald-50 p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-sm">Request ID</p>
                <p className="font-mono text-sm">{fundRequest.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Purpose</p>
                <p className="text-sm">{fundRequest.purpose}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Amount</p>
                <p className="font-semibold text-emerald-600 text-sm">
                  {formatCurrency(fundRequest.amount)}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Requestor</p>
                <p className="text-sm">
                  {fundRequest.requestorData?.name || fundRequest.requestor}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Date Requested
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {format(new Date(fundRequest.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {fundRequest.dateNeeded
                      ? format(new Date(fundRequest.dateNeeded), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {!isRejecting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <span className="mt-2 mb-2 block font-medium text-gray-700 text-sm">
                  Approval Notes (Optional)
                </span>
                <Textarea
                  placeholder="Add any final approval notes..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  disabled={
                    isPending || isUploading.signature || isUploading.audit
                  }
                />
              </div>

              <div className="space-y-2">
                <span className="block font-medium text-gray-700 text-sm">
                  Digital Signature *
                </span>
                {renderUploadArea("signature")}
              </div>

              <div className="space-y-2">
                <span className="block font-medium text-gray-700 text-sm">
                  Audit Certification *
                </span>
                {renderUploadArea("audit")}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="mt-2 mb-2 block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <Textarea
                placeholder="Please provide a reason for final rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                disabled={
                  isPending || isUploading.signature || isUploading.audit
                }
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </motion.div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setIsRejecting(true)}
                  disabled={
                    isPending || isUploading.signature || isUploading.audit
                  }
                >
                  Reject Release
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={handleApprove}
                  disabled={isPending || isSubmitDisabled}
                >
                  {isUploading.signature || isUploading.audit ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Approve Fund Release"
                  )}
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setIsRejecting(false)}
                  disabled={
                    isPending || isUploading.signature || isUploading.audit
                  }
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={
                    !rejectionReason.trim() ||
                    isPending ||
                    isUploading.signature ||
                    isUploading.audit
                  }
                >
                  Reject Request
                </Button>
              </motion.div>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
