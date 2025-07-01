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
import { CreateWaterVendoForm } from "@/features/water-vendo-igp/vendo/create-water-vendo-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateWaterVendoDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createWaterVendo"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new water vendo</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new water vendo.
            </DialogDescription>
          </DialogHeader>
          <CreateWaterVendoForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new water vendo</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a water vendo.
          </DrawerDescription>
        </DrawerHeader>
        <CreateWaterVendoForm onSuccess={handleClose} onError={handleClose} />
      </DrawerContent>
    </Drawer>
  )
}
