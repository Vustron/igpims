"use client"

import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs"
import { Button } from "@/components/ui/buttons"

import { isConfirmData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { AlertTriangle } from "lucide-react"

export const ConfirmDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "confirm"

  const handleClose = () => {
    if (isConfirmData(data) && data.resolve) {
      data.resolve(false)
    }
    onClose()
  }

  const handleConfirm = () => {
    if (isConfirmData(data) && data.resolve) {
      data.resolve(true)
    }
    onClose()
  }

  const handleCancel = () => {
    if (isConfirmData(data) && data.resolve) {
      data.resolve(false)
    }
    onClose()
  }

  const confirmData = isConfirmData(data) ? data : null

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col items-center bg-background">
                <AlertTriangle className="mb-5 size-10 text-yellow-600 dark:text-yellow-400" />
                <h2 className="mb-2 text-2xl">
                  {confirmData?.title || "Are you sure?"}
                </h2>
              </div>
            </DialogTitle>
            <DialogDescription className="text-center">
              {confirmData?.description ||
                "You are about to perform this action"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={handleCancel} className="w-full">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="w-full">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <div className="flex flex-col items-center bg-background">
              <AlertTriangle className="mb-5 size-10 text-yellow-600 dark:text-yellow-400" />
              <h2 className="mb-2 text-2xl">
                {confirmData?.title || "Are you sure?"}
              </h2>
            </div>
          </DrawerTitle>
          <DrawerDescription className="text-center">
            {confirmData?.description || "You are about to perform this action"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full flex-1">
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
