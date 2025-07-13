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
import { Label } from "@/components/ui/labels"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import {
  AlertCircle,
  ArrowDownToLine,
  Calendar,
  Target,
  User,
} from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export const ReceiveFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [confirmationNotes, setConfirmationNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest, isPending } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const handleConfirmReceipt = async () => {
    try {
      await toast.promise(
        updateRequest({
          status: "received",
          notes: confirmationNotes.trim()
            ? `Funds received by ${fundRequest?.requestorData?.name || fundRequest?.requestor}. Notes: ${confirmationNotes.trim()}`
            : `Funds received by ${fundRequest?.requestorData?.name || fundRequest?.requestor}`,
          receiptDate: new Date().toISOString(),
          currentStep: fundRequest?.currentStep
            ? fundRequest.currentStep + 1
            : 6,
        }),
        {
          loading: "Confirming fund receipt...",
          success: "Fund receipt confirmed successfully!",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setConfirmationNotes("")
    } catch (error) {
      catchError(error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isDialogOpen = isOpen && type === "receiveFunds"

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
        className={
          isDesktop
            ? "flex max-h-[90vh] max-w-2xl flex-col overflow-hidden"
            : "flex max-h-[90vh] flex-col overflow-hidden"
        }
      >
        <Header className="flex-shrink-0 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 rounded-lg bg-sky-100 p-2">
              <ArrowDownToLine className="h-5 w-5 text-sky-600" />
            </div>
            <div className="min-w-0">
              <Title className="text-lg font-semibold">
                Confirm Fund Receipt
              </Title>
              <Description className="text-sm text-muted-foreground">
                Confirm that you have successfully received the disbursed funds.
              </Description>
            </div>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Amount Display */}
            <div className="rounded-lg border bg-gradient-to-br from-sky-50 to-sky-100/50 p-6 shadow-sm">
              <div className="text-center">
                <div className="mb-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
                    Amount Received
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-sky-800">
                    {formatCurrency(fundRequest.amount)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-white/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-sky-600" />
                      <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
                        Disbursed On
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      {fundRequest.disbursementDate
                        ? formatDateFromTimestamp(fundRequest.disbursementDate)
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-md bg-white/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <User className="h-3 w-3 text-sky-600" />
                      <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
                        Requestor
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      {fundRequest.requestorData?.name || fundRequest.requestor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose Details */}
            <div className="rounded-lg border bg-gray-50/50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-full bg-gray-100 p-1.5">
                  <Target className="h-4 w-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700">Purpose</p>
                  <p className="text-sm leading-relaxed text-gray-600 break-words">
                    {fundRequest.purpose}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Notes */}
            <div className="space-y-3">
              <Label className="block text-sm font-medium text-gray-700">
                Confirmation Notes (Optional)
              </Label>
              <Textarea
                placeholder="Add any notes about the fund receipt, delivery method, or acknowledgment details..."
                value={confirmationNotes}
                onChange={(e) => setConfirmationNotes(e.target.value)}
                rows={3}
                className="w-full resize-none border-gray-300 focus:border-sky-300 focus:ring-sky-200"
                disabled={isPending}
              />
              <p className="text-xs text-gray-500">
                These notes will be added to the request history for record
                keeping.
              </p>
            </div>

            {/* Important Notice */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-full bg-amber-100 p-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800">
                    Important Notice
                  </p>
                  <p className="text-xs leading-relaxed text-amber-700">
                    By confirming receipt, you acknowledge that you have
                    received the full amount of{" "}
                    <span className="font-semibold">
                      {formatCurrency(fundRequest.amount)}
                    </span>{" "}
                    for the specified purpose. You will be responsible for
                    submitting expense receipts after utilizing the funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t px-6 py-4">
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReceipt}
              className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto"
              disabled={isPending}
            >
              Confirm Receipt
            </Button>
          </div>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
