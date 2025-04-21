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
        color="#343434"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
