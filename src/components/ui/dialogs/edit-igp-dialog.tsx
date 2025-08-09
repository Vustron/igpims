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
import { EditIgpForm } from "@/features/other-igps/igp/edit-igp-form"
import { isIgpData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditIgpDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editIgp"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isIgpData(data) || !data.igp) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit igp</DialogTitle>
            <DialogDescription>
              Update the details below of the current igp.
            </DialogDescription>
          </DialogHeader>
          <EditIgpForm
            igpId={data.igp.id}
            initialData={data.igp}
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
          <DrawerTitle>Edit igp</DrawerTitle>
          <DrawerDescription>
            Update the details below of the current igp.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <EditIgpForm
            igpId={data.igp.id}
            initialData={data.igp}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
