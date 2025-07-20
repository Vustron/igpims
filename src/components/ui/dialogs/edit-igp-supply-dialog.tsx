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
import { EditIgpSupplyForm } from "@/features/other-igps/supply/edit-igp-supply-form"
import { isIgpSupplyData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditIgpSupplyDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editIgpSupply"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isIgpSupplyData(data) || !data.igpSupply) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit igp supply</DialogTitle>
            <DialogDescription>
              Update the details below of the current igp supply.
            </DialogDescription>
          </DialogHeader>
          <EditIgpSupplyForm
            initialData={data.igpSupply}
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
          <DrawerTitle>Edit igp supply</DrawerTitle>
          <DrawerDescription>
            Update the details below of the current igp supply.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <EditIgpSupplyForm
            initialData={data.igpSupply}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
