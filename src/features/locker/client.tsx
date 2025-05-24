"use client"

import { LockerInfo } from "@/features/locker/locker-info"

interface LockerClientProps {
  id: string
}

export const LockerClient = ({ id }: LockerClientProps) => {
  return (
    <div className="container">
      <LockerInfo id={id} />
    </div>
  )
}
