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
import { CreateWaterSupplyForm } from "@/features/water-vendo-igp/supply/create-water-supply-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateWaterSupplyDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createWaterSupply"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new water supply</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new water supply.
            </DialogDescription>
          </DialogHeader>
          <CreateWaterSupplyForm
            onSuccess={handleClose}
            onError={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new water supply</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a water supply.
          </DrawerDescription>
        </DrawerHeader>
        <CreateWaterSupplyForm onSuccess={handleClose} onError={handleClose} />
      </DrawerContent>
    </Drawer>
  )
}
