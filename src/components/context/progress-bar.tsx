"use client"

import { AppProgressBar } from "next-nprogress-bar"

export const ProgressBarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <AppProgressBar
        height="4px"
        color="#4A4520"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
