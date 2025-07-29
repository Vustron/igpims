"use client"

import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { useUpdateFundRequest } from "@/backend/actions/fund-request/update-fund-request"
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
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { Image } from "@imagekit/next"
import { Calendar, DollarSign, FileText, ImageIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { PDFViewer } from "../pdf/pdf-viewer"

export const DisburseFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [disbursementNotes, setDisbursementNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest, isPending } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const handleDisburse = async () => {
    try {
      await toast.promise(
        updateRequest({
          status: "disbursed",
          notes: disbursementNotes,
          disbursementDate: new Date().setHours(0, 0, 0, 0),
          currentStep: fundRequest?.currentStep
            ? fundRequest.currentStep + 1
            : 5,
        }),
        {
          loading: "Processing fund disbursement...",
          success: "Funds disbursed successfully",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setDisbursementNotes("")
    } catch (error) {
      catchError(error)
    }
  }

  const isDialogOpen = isOpen && type === "disburseFunds"

  if (!isDialogOpen || !fundRequest) return null

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
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <Title>Disburse Funds</Title>
          </div>
          <Description>
            Process the fund disbursement to the requestor.
          </Description>
        </Header>

        <div className="p-6 space-y-4">
          {/* Request Summary */}
          <div className="rounded-lg border bg-gray-50 p-4">
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
                <p className="font-semibold text-green-600 text-sm">
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
                    {formatDateFromTimestamp(fundRequest.requestDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {fundRequest.dateNeeded
                      ? formatDateFromTimestamp(fundRequest.dateNeeded)
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Signature Section */}
          {fundRequest.digitalSignature && (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Digital Signature
              </span>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <div className="relative h-40 w-full">
                  <Image
                    src={fundRequest.digitalSignature}
                    alt="Digital Signature"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="p-2 border-t flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-700">
                      Digital Signature - Image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Certification Section */}
          {fundRequest.auditCertification && (
            <div className="space-y-2">
              <span className="block font-medium text-gray-700 text-sm">
                Audit Certification
              </span>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <div className="h-[400px] w-full">
                  <PDFViewer file={fundRequest.auditCertification} />
                </div>
                <div className="p-2 border-t flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-gray-700">
                      Audit Certification - PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disbursement Notes */}
          <div>
            <span className="mb-2 block font-medium text-gray-700 text-sm">
              Disbursement Notes (Optional)
            </span>
            <Textarea
              placeholder="Add any notes about this disbursement..."
              value={disbursementNotes}
              onChange={(e) => setDisbursementNotes(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleDisburse} disabled={isPending}>
            Confirm Disbursement
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
