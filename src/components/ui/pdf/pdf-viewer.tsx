"use client"

import { ScrollArea } from "@/components/ui/scrollareas"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { Loader2Icon } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs"

export const PDFViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
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

  const width = containerSize?.width ? Math.min(containerSize.width, 800) : 800

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    },
    [],
  )

  return (
    <div
      ref={containerRef}
      className="flex h-[70vh] w-full justify-center overflow-auto"
    >
      <ScrollArea className="mb-15">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-64 items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
          }
          error={<div className="text-red-500">Failed to load PDF</div>}
          options={pdfOptions}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              className="border-b"
              loading={
                <div className="p-4 text-center">
                  Loading page {index + 1}...
                </div>
              }
            />
          ))}
        </Document>
      </ScrollArea>
    </div>
  )
}
