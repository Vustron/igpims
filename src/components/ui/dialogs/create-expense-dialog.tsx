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
import { CreateExpenseForm } from "@/features/expense-transaction/create-expense-form"
import { isRequestId, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateExpenseDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createExpense"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isRequestId(data) || !data.requestId) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create new expense transaction</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new expense transaction.
            </DialogDescription>
          </DialogHeader>
          <CreateExpenseForm
            requestId={data.requestId}
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
          <DrawerTitle>Create new expense transaction</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new expense transaction.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <CreateExpenseForm
            requestId={data.requestId}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
