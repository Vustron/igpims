"use client"

import { AlertCircle, Clock, UserCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const VerifyUserDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "sessionExpired"

  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const handleClose = () => {
    promise?.resolve(true)
    setPromise(null)
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100">
              <div className="relative">
                <UserCheck className="size-8 text-amber-600" />
                <Clock className="-bottom-1 -right-1 absolute size-4 text-amber-500" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="font-bold text-gray-900 text-xl">
                Account Verification Required
              </DialogTitle>
              <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800 text-xs">
                <Clock className="mr-1 size-3" />
                Verification Pending
              </div>
            </div>
            <DialogDescription className="space-y-3 text-center text-gray-600 text-sm leading-relaxed">
              <p>
                Your account is still verifying. Please contact the Student
                Council President for further updates on your verification
                status.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-blue-600" />
                  <div className="text-blue-800 text-xs">
                    <p className="mb-1 font-medium">Need assistance?</p>
                    <p>
                      Please contact the{" "}
                      <span className="font-semibold">
                        Student Council President
                      </span>{" "}
                      for further updates on your verification status.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                You cannot access the system until your account has been
                verified.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button onClick={handleClose} className="min-w-[100px]">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100">
            <div className="relative">
              <UserCheck className="size-8 text-amber-600" />
              <Clock className="-bottom-1 -right-1 absolute size-4 text-amber-500" />
            </div>
          </div>
          <div className="space-y-2">
            <DrawerTitle className="font-bold text-lg">
              Account Verification Required
            </DrawerTitle>
            <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800 text-xs">
              <Clock className="mr-1 size-3" />
              Verification Pending
            </div>
          </div>
          <DrawerDescription className="mt-4 space-y-3 text-gray-600 text-sm">
            <p>
              Your account is still verifying. Please contact the Student
              Council President for further updates.
            </p>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-left">
              <div className="flex items-start space-x-2">
                <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-blue-600" />
                <div className="text-blue-800 text-xs">
                  <p className="mb-1 font-medium">Need assistance?</p>
                  <p>
                    Contact the{" "}
                    <span className="font-semibold">
                      Student Council President
                    </span>{" "}
                    for updates.
                  </p>
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <Button onClick={handleClose} className="w-full">
            OK
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
