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
import { AlertCircle } from "lucide-react"

import { useSignOutUser } from "@/backend/actions/user/sign-out"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

export const VerifyUserDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "needVerifyUser"
  const signOut = useSignOutUser({ isVerify: true })

  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const handleStay = () => {
    promise?.resolve(false)
    setPromise(null)
    onClose()
  }

  const handleClose = () => {
    promise?.resolve(true)
    setPromise(null)
    signOut.mutate()
    onClose()
  }

  const handleVerify = () => {
    promise?.resolve(true)
    setPromise(null)
    signOut.mutate()
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full">
              <AlertCircle className="size-20 text-yellow-600" />
            </div>
            <DialogTitle className="text-center font-bold">
              Email Verification Required
            </DialogTitle>
            <DialogDescription className="text-justify text-sm">
              Your email address has not been verified. Please verify your email
              to access all features. Would you like to verify your email now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={signOut.isPending}
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <DrawerTitle>Email Verification Required</DrawerTitle>
          <DrawerDescription className="text-center">
            Your email address has not been verified. Please verify your email
            to access all features. Would you like to verify your email now?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleStay}
            className="flex-1"
            disabled={signOut.isPending}
          >
            Stay
          </Button>
          <Button
            onClick={handleVerify}
            className="flex-1"
            disabled={signOut.isPending}
          >
            Verify
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
