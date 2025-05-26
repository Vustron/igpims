"use client"

import {
  ConfirmDialog,
  CreateIgpDialog,
  CheckFundsDialog,
  CreateUserDialog,
  VerifyUserDialog,
  CreateLockerDialog,
  ReceiveFundsDialog,
  DisburseFundsDialog,
  SubmitReceiptDialog,
  SessionExpiredDialog,
  ValidateExpenseDialog,
  CreateWaterFundDialog,
  CreateLockerRentDialog,
  CreateWaterVendoDialog,
  CreateFundRequestDialog,
  ReviewFundRequestDialog,
  ApproveFundRequestDialog,
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
      <ReviewFundRequestDialog />
      <CheckFundsDialog />
      <ApproveFundRequestDialog />
      <DisburseFundsDialog />
      <ReceiveFundsDialog />
      <SubmitReceiptDialog />
      <ValidateExpenseDialog />
    </>
  )
}
