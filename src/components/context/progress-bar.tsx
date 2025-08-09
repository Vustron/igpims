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
        color="#E3D14DFF"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
