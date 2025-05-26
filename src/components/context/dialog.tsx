"use client"

import {
  ConfirmDialog,
  CreateIgpDialog,
  CreateUserDialog,
  VerifyUserDialog,
  CreateLockerDialog,
  SessionExpiredDialog,
  CreateWaterFundDialog,
  CreateLockerRentDialog,
  CreateWaterVendoDialog,
  CreateFundRequestDialog,
  CreateProjectRequestDialog,
  RentalAgreementReceiptDialog,
} from "@/components/ui/dialogs"

import useMounted from "@/hooks/use-mounted"

export const DialogProvider = () => {
  const isMounted = useMounted()
  if (!isMounted) return null
  return (
    <>
      <ConfirmDialog />
      <VerifyUserDialog />
      <SessionExpiredDialog />
      <CreateLockerDialog />
      <RentalAgreementReceiptDialog />
      <CreateWaterVendoDialog />
      <CreateWaterFundDialog />
      <CreateIgpDialog />
      <CreateFundRequestDialog />
      <CreateProjectRequestDialog />
      <CreateLockerRentDialog />
      <CreateUserDialog />
    </>
  )
}
