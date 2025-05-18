"use client"

import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs"
import { CreateWaterVendoForm } from "@/features/water-vendo/create-water-vendo-form"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

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
          <CreateWaterVendoForm />
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
        <CreateWaterVendoForm />
      </DrawerContent>
    </Drawer>
  )
}
