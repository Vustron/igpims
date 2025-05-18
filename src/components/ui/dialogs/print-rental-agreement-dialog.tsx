"use client"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
} from "@/components/ui/drawers"
import { Button } from "@/components/ui/buttons"
import { Printer } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

import toast from "react-hot-toast"

export const RentalAgreementReceiptDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "printRentalAgreementReceipt"

  const receipts = [
    {
      receiptNo: "2024-0115001",
      dateIssued: "January 15,2024",
      studentName: "Michelle G. Uy",
      studentId: "2023-01155",
      course: "BSDRM 2nd Year",
      lockerId: "L-01",
      location: "AB 2F",
      dateRented: "01-15-2025",
      dateDue: "05-30-2025",
      rentalFee: "150.00",
      totalPaid: "PHP 150.00",
      paymentMethod: "Cash",
    },
  ]

  const renderReceipt = (receipt: any) => (
    <div className="w-full max-w-sm rounded border border-gray-800 p-4">
      <div className="mb-4 text-center">
        <h2 className="font-bold text-sm">DAVAO DEL NORTE STATE COLLEGE</h2>
        <p className="text-xs">SUPREME STUDENT COUNCIL</p>
        <p className="font-bold text-xs">LOCKER RENTAL RECEIPT</p>
      </div>

      <div className="mb-2 flex justify-between text-xs">
        <span>Receipt No.: {receipt.receiptNo}</span>
        <span>Date Issued: {receipt.dateIssued}</span>
      </div>

      <div className="mb-2 text-xs">
        <p>STUDENT NAME: {receipt.studentName}</p>
        <p>STUDENT ID: {receipt.studentId}</p>
        <p>COURSE & YEAR: {receipt.course}</p>
      </div>

      <div className="my-2 border-gray-800 border-t border-b py-2">
        <div className="mb-1 flex items-center gap-1">
          <span className="inline-block h-5 w-5 items-center justify-center bg-gray-200 text-xs">
            🔑
          </span>
          <span className="font-bold text-xs">LOCKER INFORMATION</span>
        </div>
        <div className="text-xs">
          <p>LOCKER ID: {receipt.lockerId}</p>
          <p>LOCATION: {receipt.location}</p>
          <p>DATE RENTED: {receipt.dateRented}</p>
          <p>DATE DUE: {receipt.dateDue}</p>
        </div>
      </div>

      <div className="py-2">
        <div className="mb-1 flex items-center gap-1">
          <span className="inline-block h-5 w-5 items-center justify-center bg-gray-200 text-xs">
            🔒
          </span>
          <span className="font-bold text-xs">LOCKER DETAILS</span>
        </div>

        <div className="text-xs">
          <div className="mb-1 flex justify-between">
            <span>Description</span>
            <span>Amount (PHP)</span>
          </div>
          <div className="flex justify-between">
            <span>Locker Rental Fee</span>
            <span>{receipt.rentalFee}</span>
          </div>
          <div className="mt-2 flex justify-between font-bold">
            <span>TOTAL PAID:</span>
            <span>{receipt.totalPaid}</span>
          </div>
          <p className="mt-1">PAYMENT METHOD: {receipt.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-gray-800 border-t pt-4">
        <div className="w-1/2 border-gray-800 border-b text-center">
          <p className="mt-4 text-xs">RENTER'S SIGNATURE</p>
        </div>
        <div className="w-1/2 border-gray-800 border-b text-center">
          <p className="mt-4 text-xs">SSC OFFICERS</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {receipts.map((receipt, index) => (
          <div key={index} className="mx-auto">
            {renderReceipt(receipt)}
          </div>
        ))}
        {receipts.map((receipt, index) => (
          <div key={`duplicate-${index}`} className="mx-auto">
            {renderReceipt(receipt)}
          </div>
        ))}
      </div>
    </div>
  )

  const handlePrint = () => {
    onClose()

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000)
      }),
      {
        loading: (
          <span className="flex items-center gap-2">
            <Printer className="h-4 w-4 animate-pulse" />
            Printing receipt...
          </span>
        ),
        success: (
          <span className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-green-500" />
            Receipt printed successfully
          </span>
        ),
        error: (
          <span className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-red-500" />
            Failed to print receipt
          </span>
        ),
      },
    )
  }

  const renderFooter = () => (
    <div className="flex w-full gap-2">
      <Button className="w-full text-white" onClick={handlePrint}>
        PRINT
      </Button>
      <Button
        variant="outline"
        className="w-full bg-red-500 text-white hover:bg-red-600"
        onClick={onClose}
      >
        RETURN
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Locker Rental Receipt</DialogTitle>
          </DialogHeader>
          {renderContent()}
          <DialogFooter>{renderFooter()}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Locker Rental Receipt</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">{renderContent()}</div>
        <DrawerFooter className="pt-2">{renderFooter()}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
