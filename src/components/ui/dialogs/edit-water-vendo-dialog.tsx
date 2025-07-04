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
import { EditWaterVendoForm } from "@/features/water-vendo-igp/vendo/edit-water-vendo-form"
import { isWaterVendoData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditWaterVendoDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editWaterVendo"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isWaterVendoData(data) || !data.waterVendo) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit water vendo</DialogTitle>
            <DialogDescription>
              Fill in the details below to edit a water vendo.
            </DialogDescription>
          </DialogHeader>
          <EditWaterVendoForm
            initialData={data.waterVendo}
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
          <DrawerTitle>Edit water vendo</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to edit a water vendo.
          </DrawerDescription>
        </DrawerHeader>
        <EditWaterVendoForm
          initialData={data.waterVendo}
          onSuccess={handleClose}
          onError={handleClose}
        />
      </DrawerContent>
    </Drawer>
  )
}
