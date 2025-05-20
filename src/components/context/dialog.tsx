"use client"

import {
  CreateIgpDialog,
  ConfirmDialog,
  VerifyUserDialog,
  CreateLockerDialog,
  SessionExpiredDialog,
  CreateWaterFundDialog,
  CreateWaterVendoDialog,
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
    </>
  )
}
