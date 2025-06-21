"use client"

import { format } from "date-fns"
import { Calendar, DollarSign } from "lucide-react"
import { useState } from "react"
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
import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const DisburseFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, approveRequest } = useFundRequestStore()
  const [disbursementNotes, setDisbursementNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "disburseFunds"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleDisburse = () => {
    if (request) {
      const notes = `Funds disbursed. ${disbursementNotes ? `Notes: ${disbursementNotes}` : ""}`

      approveRequest(request.id, notes)

      onClose()
      resetForm()
    } else {
      console.error("Disbursement method and reference number are required.")
    }
  }

  const resetForm = () => {
    setDisbursementNotes("")
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
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <Title>Disburse Funds</Title>
          </div>
          <Description>
            Process the fund disbursement to the requestor.
          </Description>
        </Header>

        <div className="space-y-4 p-6">
          {/* Disbursement Summary */}

          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-sm">Request ID</p>
                <p className="font-mono text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Purpose</p>
                <p className="text-sm">{request.purpose}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Amount</p>
                <p className="font-semibold text-green-600 text-sm">
                  {formatCurrency(request.amount)}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Requestor</p>
                <p className="text-sm">{request.requestor}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">
                  Date Requested
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {format(new Date(request.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {request.dateNeeded
                      ? format(new Date(request.dateNeeded), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disbursement Details */}
          <div className="space-y-4">
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Disbursement Notes (Optional)
              </span>
              <Textarea
                placeholder="Add any disbursement notes..."
                value={disbursementNotes}
                onChange={(e) => setDisbursementNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleDisburse}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Approve Disbursement
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
