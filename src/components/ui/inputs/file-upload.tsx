"use client"

import { getImagekitUploadAuth } from "@/backend/actions/imagekit-api/upload-auth"
import { Label } from "@/components/ui/labels"
import { cn } from "@/utils/cn"
import {
  Image,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next"
import { motion } from "framer-motion"
import { FileIcon, UploadIcon, XCircleIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

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
  isUsingImagekit?: boolean
}

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 1, y: -1, opacity: 0.9 },
}

const isImageFile = (file: FileValue): boolean => {
  if (file instanceof File) {
    return file.type.startsWith("image/")
  }

  return (
    typeof file === "string" &&
    (file.startsWith("data:image/") || file.includes("ik.imagekit.io"))
  )
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
  if (typeof file === "string" && file.includes("ik.imagekit.io")) {
    const url = new URL(file)
    return url.pathname.split("/").pop() || "Uploaded Image"
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
  isUsingImagekit = false,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileValue[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isInitialMount = useRef(true)

  const memoizedOnChange = useCallback(onChange || (() => {}), [onChange])

  useEffect(() => {
    if (value) {
      setFiles([value])
    } else {
      setFiles([])
    }
  }, [value])

  const handleImageKitUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    abortControllerRef.current = new AbortController()

    try {
      const authParams = await getImagekitUploadAuth()
      const { signature, expire, token, publicKey } = authParams

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "/igpmis/",
        onProgress: (event) => {
          setUploadProgress((event.loaded / event.total) * 100)
        },
        abortSignal: abortControllerRef.current.signal,
      })

      setIsUploading(false)
      return uploadResponse.url
    } catch (error) {
      setIsUploading(false)
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload was cancelled")
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid upload request")
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error during upload")
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error during upload")
      } else {
        toast.error("Failed to upload file")
      }
      throw error
    }
  }

  const handleFileChange = async (newFiles: File[]) => {
    if (newFiles.length === 0) return

    try {
      if (isUsingImagekit) {
        const uploadedUrls = await Promise.all(
          newFiles.map(async (file) => {
            const url = await handleImageKitUpload(file)
            return url as string
          }),
        ).then((urls) => urls.filter((url): url is string => url !== undefined))

        const updatedFiles = multiple
          ? [...files, ...uploadedUrls].slice(0, maxFiles)
          : uploadedUrls.length > 0
            ? [uploadedUrls[0]]
            : files

        // @ts-ignore
        setFiles(updatedFiles)
        if (!isInitialMount.current) {
          // @ts-ignore
          memoizedOnChange?.(updatedFiles)
        }
      } else {
        const validFiles = newFiles
          .slice(0, maxFiles)
          .filter((file): file is File => file !== undefined)
        const updatedFiles = multiple
          ? [...files, ...validFiles].slice(0, maxFiles)
          : validFiles.length > 0
            ? [validFiles[0]]
            : files
        // @ts-ignore
        setFiles(updatedFiles)
        if (!isInitialMount.current) {
          // @ts-ignore
          memoizedOnChange?.(updatedFiles)
        }
      }
    } catch (error) {
      console.error("File upload error:", error)
    }
  }

  const handleRemoveFile = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newFiles = files.filter((_, idx) => idx !== indexToRemove)
    setFiles(newFiles)
    memoizedOnChange?.(newFiles)
  }

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsUploading(false)
    setUploadProgress(0)
  }

  useEffect(() => {
    isInitialMount.current = false
    return () => {
      cancelUpload()
    }
  }, [])

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    noClick: true,
    maxFiles,
    accept: accept ? { [accept]: [] } : undefined,
    onDrop: handleFileChange,
    disabled: isUploading,
  })

  return (
    <div className="w-full space-y-1">
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
          whileHover={isUploading ? undefined : "animate"}
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
            disabled={isUploading}
          />

          <div className="relative w-full">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 p-2">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-xs">Uploading...</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        cancelUpload()
                      }}
                      className="text-red-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {files.length > 0 ? (
              <div className="grid gap-2">
                {files.map((file, idx) => (
                  <motion.div
                    key={`file-${idx}`}
                    layoutId={`file-upload-${idx}`}
                    className="relative flex w-full items-start gap-2 overflow-hidden rounded-md bg-background p-2"
                  >
                    <motion.button
                      onClick={(e) => handleRemoveFile(idx, e)}
                      className="absolute top-1 right-1 rounded-full bg-white/80 p-0.5 backdrop-blur-sm hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
                    >
                      <XCircleIcon className="size-4 sm:size-5 text-neutral-500 hover:text-red-500" />
                    </motion.button>

                    {isImageFile(file) ? (
                      <div className="relative size-8 sm:size-10 overflow-hidden rounded-md">
                        <Image
                          src={getImageUrl(file)}
                          alt={getFileName(file)}
                          className="size-full object-fill"
                          width={50}
                          height={50}
                          unoptimized={true}
                        />
                      </div>
                    ) : (
                      <div className="flex size-8 sm:size-10 items-center justify-center rounded-md bg-muted">
                        <FileIcon className="size-3 sm:size-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col min-w-0">
                      <motion.p className="truncate text-foreground text-xs sm:text-sm">
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
                className="relative flex h-10 sm:h-12 w-full items-center justify-center rounded-md bg-background"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"
                  >
                    Drop {multiple ? "files" : "file"}
                    <UploadIcon className="size-3 sm:size-4" />
                  </motion.p>
                ) : (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                    Click to upload {multiple ? `(max ${maxFiles} files)` : ""}
                    <UploadIcon className="size-3 sm:size-4" />
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
