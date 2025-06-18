"use client"

import { FileIcon, UploadIcon, XCircleIcon } from "lucide-react"
import { Label } from "@/components/ui/labels"
import Image from "next/image"

import { useRef, useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

type FileValue = File | string

interface FileUploadProps {
  onChange?: (files: FileValue[]) => void
  className?: string
  label?: string
  hasErrors?: boolean
  value?: FileValue | null
  multiple?: boolean
  maxFiles?: number
  accept?: string
}

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 1, y: -1, opacity: 0.9 },
}

const isImageFile = (file: FileValue): boolean => {
  if (file instanceof File) {
    return file.type.startsWith("image/")
  }
  return typeof file === "string" && file.startsWith("data:image/")
}

const getFileSize = (file: FileValue): string => {
  if (file instanceof File) {
    return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
  }
  return "Stored Image"
}

const getFileName = (file: FileValue): string => {
  if (file instanceof File) {
    return file.name
  }
  return "Uploaded Image"
}

const getImageUrl = (file: FileValue): string => {
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  return file
}

export const FileUpload = ({
  onChange,
  className,
  label,
  hasErrors,
  value,
  multiple = false,
  maxFiles = 1,
  accept,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileValue[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInitialMount = useRef(true)

  const memoizedOnChange = useCallback(onChange || (() => {}), [onChange])

  useEffect(() => {
    if (value) {
      setFiles([value])
    } else {
      setFiles([])
    }
  }, [value])

  const handleFileChange = (newFiles: File[]) => {
    if (!multiple) {
      const singleFile = newFiles[0] ? [newFiles[0]] : []
      setFiles(singleFile)
      if (!isInitialMount.current) {
        memoizedOnChange?.(singleFile)
      }
      return
    }

    const validFiles = newFiles.slice(0, maxFiles)
    setFiles((prev) => {
      const combined = [...prev, ...validFiles]
      const limited = combined.slice(0, maxFiles)
      if (!isInitialMount.current) {
        memoizedOnChange?.(limited)
      }
      return limited
    })
  }

  const handleRemoveFile = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newFiles = files.filter((_, idx) => idx !== indexToRemove)
    setFiles(newFiles)
    memoizedOnChange?.(newFiles)
  }

  useEffect(() => {
    isInitialMount.current = false
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    noClick: true,
    maxFiles,
    accept: accept ? { [accept]: [] } : undefined,
    onDrop: handleFileChange,
  })

  return (
    <>
      {label && (
        <Label className="bg-background px-2 text-muted-foreground text-xs">
          {label}
        </Label>
      )}
      <div
        className={cn(
          "w-full rounded-md border",
          hasErrors ? "border-red-500" : "border-input",
          className,
        )}
        {...getRootProps()}
      >
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="group/file relative block w-full cursor-pointer overflow-hidden rounded-md p-1"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
            aria-label={label || "File upload"}
          />

          <div className="relative w-full">
            {files.length > 0 ? (
              <div className="grid gap-2">
                {files.map((file, idx) => (
                  <motion.div
                    key={`file-${idx}`}
                    layoutId={`file-upload-${idx}`}
                    className="relative z-40 mx-auto flex w-full items-start gap-2 overflow-hidden rounded-md bg-background p-2"
                  >
                    <motion.button
                      onClick={(e) => handleRemoveFile(idx, e)}
                      className="absolute top-1 right-1 z-50 rounded-full bg-white/80 p-0.5 backdrop-blur-sm hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
                    >
                      <XCircleIcon className="size-5 text-neutral-500 hover:text-red-500" />
                    </motion.button>

                    {isImageFile(file) ? (
                      <div className="relative size-8 overflow-hidden rounded-md">
                        <Image
                          src={getImageUrl(file)}
                          alt={getFileName(file)}
                          className="size-full object-fill"
                        />
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                        <FileIcon className="size-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col">
                      <motion.p className="max-w-xs truncate text-foreground text-xs">
                        {getFileName(file)}
                      </motion.p>
                      <motion.p className="text-muted-foreground text-xs">
                        {getFileSize(file)}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 500, damping: 50 }}
                className="relative z-40 mx-auto flex h-8 w-full items-center justify-center rounded-md bg-background"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground text-xs"
                  >
                    Drop {multiple ? "files" : "file"}
                    <UploadIcon className="size-3" />
                  </motion.p>
                ) : (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    Click to upload {multiple ? `(max ${maxFiles} files)` : ""}
                    <UploadIcon className="size-3" />
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
