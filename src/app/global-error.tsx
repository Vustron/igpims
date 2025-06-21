"use client"

import Link from "next/link"
import { useEffect } from "react"
import { ErrorHandler, ErrorResponseData } from "@/utils/error"

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    const { message }: ErrorResponseData = ErrorHandler.handleError(error)
    console.error(message)
  }, [error])

  return (
    <html lang="en">
      <body className="size-full">
        <section className="flex min-h-[100vh] flex-col items-center justify-center">
          <h1 className="max-w-md scroll-m-20 text-center font-extrabold text-4xl tracking-tight lg:text-5xl">
            Something went wrong. 🤔
          </h1>

          <p className="mt-[50px] animate-pulse text-center font-md text-red-600 text-xl">
            {error.message}
          </p>

          <Link href="/">
            <p className="mt-[50px] animate-pulse text-center font-md text-xl hover:text-slate-700">
              Go back
            </p>
          </Link>
        </section>
      </body>
    </html>
  )
}
