"use client"

import { Navbar } from "./navbar"

interface ContentLayoutProps {
  children: React.ReactNode
  title: string
}

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <div>
      <Navbar title={title} />
      <div className="container px-4 pt-8 pb-8 sm:px-8">{children}</div>
    </div>
  )
}
