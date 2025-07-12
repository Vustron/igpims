"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { EditExpenseForm } from "@/features/expense-transaction/edit-expense-form"
import { isExpenseTransactionData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditExpenseDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editExpense"

  const handleClose = () => {
    onClose()
  }

  if (
    !isDialogOpen ||
    !isExpenseTransactionData(data) ||
    !data.expenseTransaction
  ) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit expense transaction</DialogTitle>
            <DialogDescription>
              Update the details below of the current expense transaction.
            </DialogDescription>
          </DialogHeader>
          <EditExpenseForm
            initialData={data.expenseTransaction || undefined}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Edit expense transaction</DrawerTitle>
          <DrawerDescription>
            Update the details below of the current expense transaction.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <EditExpenseForm
            initialData={data.expenseTransaction || undefined}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
