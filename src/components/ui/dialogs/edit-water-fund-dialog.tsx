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
import { EditWaterFundForm } from "@/features/water-vendo-igp/funds/edit-water-fund-form"
import { isWaterFundData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditWaterFundDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editWaterFund"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isWaterFundData(data) || !data.waterFund) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Edit water fund</DialogTitle>
            <DialogDescription>
              Update the water fund details below.
            </DialogDescription>
          </DialogHeader>
          <EditWaterFundForm
            initialData={data.waterFund}
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
          <DrawerTitle>Edit water fund</DrawerTitle>
          <DrawerDescription>
            Update the water fund details below.
          </DrawerDescription>
        </DrawerHeader>
        <EditWaterFundForm
          initialData={data.waterFund}
          onSuccess={handleClose}
          onError={handleClose}
        />
      </DrawerContent>
    </Drawer>
  )
}
