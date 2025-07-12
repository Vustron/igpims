"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { isViewImageData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ScrollArea } from "../scrollareas"
import VisuallyHiddenComponent from "../separators/visually-hidden"

export const ViewImageDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [isLoading, setIsLoading] = useState(true)
  const [imageDimensions, setImageDimensions] = useState({
    width: 800,
    height: 600,
  })

  const isDialogOpen = isOpen && type === "viewImage"
  const imgUrl = isViewImageData(data) ? data.imgUrl : null

  const handleClose = useCallback(() => {
    setIsLoading(true)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isDialogOpen && imgUrl) {
      const img = new window.Image()
      img.src = imgUrl
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        })
        setIsLoading(false)
      }
      img.onerror = () => setIsLoading(false)
    }
  }, [isDialogOpen, imgUrl])

  if (!isDialogOpen || !imgUrl) {
    return null
  }

  const aspectRatio = imageDimensions.width / imageDimensions.height
  const isPortrait = aspectRatio < 1

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent
          className={`max-w-[95vw] max-h-[95vh] p-0 overflow-hidden ${isPortrait ? "w-auto" : "w-[90vw]"}`}
        >
          <VisuallyHiddenComponent>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg">Receipt Preview</DialogTitle>
              </div>
            </DialogHeader>
          </VisuallyHiddenComponent>

          <div className="relative flex-1 flex items-center justify-center p-6 mb-20">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 w-full bg-gray-100 rounded-md animate-pulse">
                <span className="text-gray-500">Loading image...</span>
              </div>
            ) : (
              <ScrollArea className="w-full h-full">
                <div className="flex items-center justify-center p-2">
                  <Image
                    src={imgUrl}
                    alt="Receipt"
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    className={"max-h-[80vh] mt-2"}
                    style={{
                      objectFit: "contain",
                    }}
                    unoptimized={true}
                    priority
                  />
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="p-4 border-t text-sm text-gray-500 text-center">
            {imageDimensions.width} × {imageDimensions.height} px
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleClose}>
      <DrawerContent className="h-[95vh] max-h-screen">
        <VisuallyHiddenComponent>
          <DrawerHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg">Receipt Preview</DrawerTitle>
            </div>
          </DrawerHeader>
        </VisuallyHiddenComponent>
        <div className="relative flex-1 w-full h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-100 animate-pulse">
              <span className="text-gray-500">Loading image...</span>
            </div>
          ) : (
            <ScrollArea className="h-full w-full">
              <div className="flex items-center justify-center p-4">
                <Image
                  src={imgUrl}
                  alt="Receipt"
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  className="max-h-[80vh] mt-2"
                  style={{
                    objectFit: "contain",
                  }}
                  unoptimized={true}
                  priority
                />
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="p-4 border-t text-sm text-gray-500 text-center">
          {imageDimensions.width} × {imageDimensions.height} px
        </div>
      </DrawerContent>
    </Drawer>
  )
}
