"use client"

import { useRef, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import SignaturePad from "react-signature-pad-wrapper"

export default function TestPage() {
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
      setIsEmpty(true)
    }
  }

  const handleSubmit = () => {
    if (isEmpty) {
      toast.error("Please provide a signature first")
      return
    }

    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL()
      toast.success("Signature submitted!", {
        duration: 4000,
        icon: (
          <img
            src={signatureData}
            alt="Signature"
            style={{ height: "100px", border: "1px solid #ccc" }}
          />
        ),
      })
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Signature Test</h1>

      <div className="border rounded-lg overflow-hidden mb-4">
        <SignaturePad
          ref={signaturePadRef}
          options={{
            minWidth: 1,
            maxWidth: 3,
            penColor: "rgb(0, 0, 0)",
            backgroundColor: "rgb(255, 255, 255)",
          }}
          canvasProps={{
            width: "500",
            height: "200",
            className: "w-full h-50 bg-white",
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Signature
        </button>
      </div>

      <Toaster position="bottom-center" />
    </div>
  )
}
