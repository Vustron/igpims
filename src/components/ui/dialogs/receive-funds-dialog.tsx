"use client"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs/dialog"
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import {
  ArrowDownToLine,
  Calendar,
  Target,
  User,
  AlertCircle,
} from "lucide-react"

import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"
import { format } from "date-fns/format"
import toast from "react-hot-toast"

export const ReceiveFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest } = useFundRequestStore()
  const [confirmationNotes, setConfirmationNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "receiveFunds"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleConfirmReceipt = () => {
    if (request) {
      const notes = confirmationNotes.trim()
        ? `Funds received by ${request.requestor}. Notes: ${confirmationNotes.trim()}`
        : `Funds received by ${request.requestor}.`

      approveRequest(request.id, notes)
      toast.success("Fund receipt confirmed successfully!")
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setConfirmationNotes("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
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
              <Title className="font-semibold text-lg">
                Confirm Fund Receipt
              </Title>
              <Description className="text-muted-foreground text-sm">
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
                  <p className="font-medium text-sky-700 text-sm uppercase tracking-wide">
                    Amount Received
                  </p>
                  <p className="font-bold text-3xl text-sky-800 tracking-tight">
                    {formatCurrency(request.amount)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-white/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-sky-600" />
                      <p className="font-medium text-sky-700 text-xs uppercase tracking-wide">
                        Disbursed On
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {request.disbursementDate
                        ? format(
                            new Date(request.disbursementDate),
                            "MMM d, yyyy",
                          )
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-md bg-white/60 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <User className="h-3 w-3 text-sky-600" />
                      <p className="font-medium text-sky-700 text-xs uppercase tracking-wide">
                        Requestor
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm">{request.requestor}</p>
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
                  <p className="font-medium text-gray-700 text-sm">Purpose</p>
                  <p className="break-words text-gray-600 text-sm leading-relaxed">
                    {request.purpose}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Notes */}
            <div className="space-y-3">
              <Label className="block font-medium text-gray-700 text-sm">
                Confirmation Notes (Optional)
              </Label>
              <Textarea
                placeholder="Add any notes about the fund receipt, delivery method, or acknowledgment details..."
                value={confirmationNotes}
                onChange={(e) => setConfirmationNotes(e.target.value)}
                rows={3}
                className="w-full resize-none border-gray-300 focus:border-sky-300 focus:ring-sky-200"
              />
              <p className="text-gray-500 text-xs">
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
                  <p className="font-medium text-amber-800 text-sm">
                    Important Notice
                  </p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    By confirming receipt, you acknowledge that you have
                    received the full amount of{" "}
                    <span className="font-semibold">
                      {formatCurrency(request.amount)}
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
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReceipt}
              className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto"
            >
              Confirm Receipt
            </Button>
          </div>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
