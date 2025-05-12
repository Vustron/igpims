"use client"

import { RenterInfo } from "@/features/locker/renter-info"

interface LockerClientProps {
  id: string
}

export const LockerClient = ({ id }: LockerClientProps) => {
  return (
    <div className="container">
      <RenterInfo id={id} />
    </div>
  )
}
