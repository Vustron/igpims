"use client"

import {
  ApproveFundRequestDialog,
  ApproveProjectRequestDialog,
  CheckFundsDialog,
  CompleteProjectDialog,
  ConfirmDialog,
  CreateFundRequestDialog,
  CreateIgpDialog,
  CreateInspectionDialog,
  CreateLockerDialog,
  CreateLockerRentDialog,
  CreateProjectRequestDialog,
  CreateResolutionDialog,
  CreateUserDialog,
  CreateViolationDialog,
  CreateWaterFundDialog,
  CreateWaterVendoDialog,
  DeleteFundRequestDialog,
  DeleteProjectRequestDialog,
  DisburseFundsDialog,
  DueOverduePaymentsDialog,
  EditInspectionDialog,
  EditViolationDialog,
  IgpFinancialReportDialog,
  PrintIgpStatusDialog,
  ProfitLossDialog,
  ReceiveFundsDialog,
  RentalAgreementReceiptDialog,
  ReviewFundRequestDialog,
  ReviewProjectRequestDialog,
  SendEmailLockerViolationDialog,
  SessionExpiredDialog,
  StartImplementationDialog,
  SubmitReceiptDialog,
  ValidateExpenseDialog,
  VerifyUserDialog,
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
      <ProfitLossDialog />
      <IgpFinancialReportDialog />
      <DueOverduePaymentsDialog />
      <PrintIgpStatusDialog />
      <SendEmailLockerViolationDialog />
      <ReviewProjectRequestDialog />
      <CreateResolutionDialog />
      <ApproveProjectRequestDialog />
      <StartImplementationDialog />
      <CompleteProjectDialog />
      <DeleteProjectRequestDialog />
      <DeleteFundRequestDialog />
      <CreateViolationDialog />
      <EditViolationDialog />
      <CreateInspectionDialog />
      <EditInspectionDialog />
    </>
  )
}
