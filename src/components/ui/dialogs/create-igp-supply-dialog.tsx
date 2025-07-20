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
import { CreateIgpSupplyForm } from "@/features/other-igps/supply/create-igp-supply-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateIgpSupplyDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createIgpSupply"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create new igp supply</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new igp supply.
            </DialogDescription>
          </DialogHeader>
          <CreateIgpSupplyForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new igp supply</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new igp supply.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <CreateIgpSupplyForm onSuccess={handleClose} onError={handleClose} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
