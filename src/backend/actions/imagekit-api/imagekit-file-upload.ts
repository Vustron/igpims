import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next"
import toast from "react-hot-toast"
import { ImagekitUploadAuth, getImagekitUploadAuth } from "./upload-auth"

export const imagekitFileUpload = async ({ fileInput }: { fileInput: any }) => {
  const fileInputData = fileInput.current
  if (
    !fileInputData ||
    !fileInputData.files ||
    fileInputData.files.length === 0
  ) {
    toast.error("Please select a file to upload")
    return
  }

  const file = fileInputData.files[0]
  let authParams: ImagekitUploadAuth

  try {
    authParams = await getImagekitUploadAuth()
  } catch (authError) {
    console.error("Failed to authenticate for upload:", authError)
    return
  }

  const { signature, expire, token, publicKey } = authParams

  try {
    const uploadResponse = await upload({
      expire,
      token,
      signature,
      publicKey,
      file,
      fileName: file.name,
    })
    console.log("Upload response:", uploadResponse)
  } catch (error) {
    if (error instanceof ImageKitAbortError) {
      console.error("Upload aborted:", error.reason)
    } else if (error instanceof ImageKitInvalidRequestError) {
      console.error("Invalid request:", error.message)
    } else if (error instanceof ImageKitUploadNetworkError) {
      console.error("Network error:", error.message)
    } else if (error instanceof ImageKitServerError) {
      console.error("Server error:", error.message)
    } else {
      console.error("Upload error:", error)
    }
  }
}
