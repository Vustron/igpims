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
import { CreateWaterFundForm } from "@/features/water-vendo/create-water-fund-form"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

export const CreateWaterFundDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createWaterFund"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new water fund</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new water fund.
            </DialogDescription>
          </DialogHeader>
          <CreateWaterFundForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new water fund</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a water fund.
          </DrawerDescription>
        </DrawerHeader>
        <CreateWaterFundForm />
      </DrawerContent>
    </Drawer>
  )
}
