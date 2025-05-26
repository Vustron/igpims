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
import { CheckCircle2 } from "lucide-react"

import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

export const ApproveFundRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest, rejectRequest } =
    useFundRequestStore()
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "approveFundRequest"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleApprove = () => {
    if (request) {
      approveRequest(request.id, approvalNotes)
      onClose()
      resetForm()
    }
  }

  const handleReject = () => {
    if (request && rejectionReason.trim()) {
      rejectRequest(request.id, rejectionReason, 4)
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setApprovalNotes("")
    setRejectionReason("")
    setIsRejecting(false)
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
      <Content className={isDesktop ? "max-w-2xl" : ""}>
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

        <div className="space-y-4 p-6">
          {/* Request Summary */}
          <div className="rounded-lg border bg-emerald-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-emerald-700 text-sm">
                  Request ID
                </p>
                <p className="font-mono text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-emerald-700 text-sm">
                  Allocated Amount
                </p>
                <p className="font-semibold text-emerald-800 text-lg">
                  {formatCurrency(request.allocatedFunds)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-emerald-700 text-sm">Purpose</p>
                <p className="text-sm">{request.purpose}</p>
              </div>
            </div>
          </div>

          {!isRejecting ? (
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Approval Notes (Optional)
              </span>
              <Textarea
                placeholder="Add any final approval notes..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div>
              <span className="mb-2 block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <Textarea
                placeholder="Please provide a reason for final rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(true)}>
                Reject Release
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Fund Release
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Release
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
