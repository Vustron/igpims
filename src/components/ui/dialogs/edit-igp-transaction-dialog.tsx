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
import { UpdateIgpTransactionForm } from "@/features/other-igps/transactions/edit-igp-transaction-form"
import { isIgpTransactionData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditIgpTransactionDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editIgpTransaction"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isIgpTransactionData(data) || !data.igpTransaction) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create new igp transaction</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new igp transaction.
            </DialogDescription>
          </DialogHeader>
          <UpdateIgpTransactionForm
            initialData={data.igpTransaction}
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
          <DrawerTitle>Create new igp transaction</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new igp transaction.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <UpdateIgpTransactionForm
            initialData={data.igpTransaction}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
