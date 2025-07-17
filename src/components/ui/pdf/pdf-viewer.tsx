"use client"

import { Button } from "@/components/ui/buttons"
import { ScrollArea } from "@/components/ui/scrollareas"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import {
  Loader2Icon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs"

export const PDFViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState<number>(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pdfWrapperRef = useRef<HTMLDivElement | null>(null)

  const [containerSize, setContainerSize] = useState<{
    width: number
    height: number
  } | null>(null)

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
      disableStream: true,
      disableAutoFetch: true,
    }),
    [],
  )

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    const entry = entries[0]
    if (entry?.contentRect) {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    }
  }, [])

  useResizeObserver(containerRef.current, undefined, handleResize)

  const width = containerSize?.width
    ? Math.min(containerSize.width, 800) * scale
    : 600 * scale

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    },
    [],
  )

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (pdfWrapperRef.current?.requestFullscreen) {
        pdfWrapperRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement)
  }, [])

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [handleFullscreenChange])

  return (
    <div className="relative flex flex-col h-[70vh] w-full max-w-full">
      <div className="flex items-center justify-end gap-2 p-2 bg-gray-50 border-b">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <span className="text-sm text-gray-600">
          {Math.round(scale * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 2}
              className="p-2"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="p-2"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </TooltipContent>
        </Tooltip>
      </div>

      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <div ref={pdfWrapperRef} className="h-full w-full overflow-auto">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col items-center min-h-full justify-center py-4">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex h-full items-center justify-center">
                    <Loader2Icon className="h-8 w-8 animate-spin" />
                  </div>
                }
                error={
                  <div className="flex h-full items-center justify-center text-red-500">
                    Failed to load PDF
                  </div>
                }
                options={pdfOptions}
                className="w-full"
              >
                {Array.from(new Array(numPages), (_el, index) => (
                  <div
                    key={`page-wrapper-${index + 1}`}
                    className="flex justify-center mb-4 last:mb-0"
                  >
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={width}
                      className="border-b shadow-sm"
                      loading={
                        <div className="p-4 text-center">
                          Loading page {index + 1}...
                        </div>
                      }
                    />
                  </div>
                ))}
              </Document>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
