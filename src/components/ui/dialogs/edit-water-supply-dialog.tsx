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
import { EditWaterSupplyForm } from "@/features/water-vendo-igp/supply/edit-water-supply-form.tsx"
import { isWaterSupplyData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditWaterSupplyDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editWaterSupply"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isWaterSupplyData(data) || !data.waterSupply) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit water supply</DialogTitle>
            <DialogDescription>
              Fill in the details below to edit a water supply.
            </DialogDescription>
          </DialogHeader>
          <EditWaterSupplyForm
            initialData={data.waterSupply}
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
            Fill in the details below to edit a water supply.
          </DrawerDescription>
        </DrawerHeader>
        <EditWaterSupplyForm
          initialData={data.waterSupply}
          onSuccess={handleClose}
          onError={handleClose}
        />
      </DrawerContent>
    </Drawer>
  )
}
