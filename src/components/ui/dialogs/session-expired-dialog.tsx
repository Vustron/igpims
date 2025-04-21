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
import { AlertCircle, Loader2Icon } from "lucide-react"
import { toast } from "react-hot-toast"

import { cleanupSession } from "@/backend/helpers/cleanup-session"
import { catchError } from "@/utils/catch-error"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

export const SessionExpiredDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "sessionExpired"
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleClose = async () => {
    try {
      setIsSigningOut(true)
      await cleanupSession()
      window.location.reload()
    } catch (error) {
      setIsSigningOut(false)
      toast.error(`Failed to sign out: ${catchError(error)}`)
      console.error("Sign out failed:", error)
    } finally {
      setIsSigningOut(false)
      onClose()
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full">
              <AlertCircle className="size-20 text-red-600" />
            </div>
            <DialogTitle className="text-center font-bold">
              Session Expired
            </DialogTitle>
            <DialogDescription className="text-justify text-sm">
              Your session has expired or is invalid. Please sign in again to
              continue using the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              onClick={handleClose}
              className="w-full"
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2Icon className="size-6 animate-spin" />
              ) : (
                "Sign In Again"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="size-6 text-red-600" />
          </div>
          <DrawerTitle>Session Expired</DrawerTitle>
          <DrawerDescription>
            Your session has expired or is invalid. Please sign in again to
            continue using the application.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleClose}
            className="w-full"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              "Sign In Again"
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
