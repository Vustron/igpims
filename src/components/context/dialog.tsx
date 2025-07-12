"use client"

import useMounted from "@/hooks/use-mounted"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const ConfirmDialog = dynamic(() =>
  import("@/components/ui/dialogs/confirm-dialog").then(
    (mod) => mod.ConfirmDialog,
  ),
)
const VerifyUserDialog = dynamic(() =>
  import("@/components/ui/dialogs/verify-user-dialog").then(
    (mod) => mod.VerifyUserDialog,
  ),
)
const SessionExpiredDialog = dynamic(() =>
  import("@/components/ui/dialogs/session-expired-dialog").then(
    (mod) => mod.SessionExpiredDialog,
  ),
)
const CreateLockerDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-locker-dialog").then(
    (mod) => mod.CreateLockerDialog,
  ),
)
const RentalAgreementReceiptDialog = dynamic(() =>
  import("@/components/ui/dialogs/print-rental-agreement-dialog").then(
    (mod) => mod.RentalAgreementReceiptDialog,
  ),
)
const CreateWaterVendoDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-water-vendo-dialog").then(
    (mod) => mod.CreateWaterVendoDialog,
  ),
)
const CreateWaterFundDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-water-fund-dialog").then(
    (mod) => mod.CreateWaterFundDialog,
  ),
)
const CreateIgpDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-igp-dialog").then(
    (mod) => mod.CreateIgpDialog,
  ),
)
const CreateFundRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-fund-request-dialog").then(
    (mod) => mod.CreateFundRequestDialog,
  ),
)
const CreateProjectRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-project-request-dialog").then(
    (mod) => mod.CreateProjectRequestDialog,
  ),
)
const CreateLockerRentDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-rent-dialog").then(
    (mod) => mod.CreateLockerRentDialog,
  ),
)
const CreateUserDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-user-dialog").then(
    (mod) => mod.CreateUserDialog,
  ),
)
const ReviewFundRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/review-fund-request-dialog").then(
    (mod) => mod.ReviewFundRequestDialog,
  ),
)
const CheckFundsDialog = dynamic(() =>
  import("@/components/ui/dialogs/check-funds-dialog").then(
    (mod) => mod.CheckFundsDialog,
  ),
)
const ApproveFundRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/approve-fund-request-dialog").then(
    (mod) => mod.ApproveFundRequestDialog,
  ),
)
const DisburseFundsDialog = dynamic(() =>
  import("@/components/ui/dialogs/disburse-funds-dialog").then(
    (mod) => mod.DisburseFundsDialog,
  ),
)
const ReceiveFundsDialog = dynamic(() =>
  import("@/components/ui/dialogs/receive-funds-dialog").then(
    (mod) => mod.ReceiveFundsDialog,
  ),
)
const SubmitReceiptDialog = dynamic(() =>
  import("@/components/ui/dialogs/submit-receipt-dialog").then(
    (mod) => mod.SubmitReceiptDialog,
  ),
)
const ValidateExpenseDialog = dynamic(() =>
  import("@/components/ui/dialogs/validate-expense-dialog").then(
    (mod) => mod.ValidateExpenseDialog,
  ),
)
const ProfitLossDialog = dynamic(() =>
  import("@/components/ui/dialogs/print-profit-loss-dialog").then(
    (mod) => mod.ProfitLossDialog,
  ),
)
const IgpFinancialReportDialog = dynamic(() =>
  import("@/components/ui/dialogs/print-igp-financial-report-dialog").then(
    (mod) => mod.IgpFinancialReportDialog,
  ),
)
const DueOverduePaymentsDialog = dynamic(() =>
  import("@/components/ui/dialogs/print-due-overdue-payments-dialog").then(
    (mod) => mod.DueOverduePaymentsDialog,
  ),
)
const PrintIgpStatusDialog = dynamic(() =>
  import("@/components/ui/dialogs/print-igp-status-dialog").then(
    (mod) => mod.PrintIgpStatusDialog,
  ),
)
const SendEmailLockerViolationDialog = dynamic(() =>
  import("@/components/ui/dialogs/send-email-locker-violation-dialog").then(
    (mod) => mod.SendEmailLockerViolationDialog,
  ),
)
const ReviewProjectRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/review-project-request-dialog").then(
    (mod) => mod.ReviewProjectRequestDialog,
  ),
)
const CreateResolutionDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-resolution-dialog").then(
    (mod) => mod.CreateResolutionDialog,
  ),
)
const ApproveProjectRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/approve-project-request-dialog").then(
    (mod) => mod.ApproveProjectRequestDialog,
  ),
)
const StartImplementationDialog = dynamic(() =>
  import("@/components/ui/dialogs/start-implementation-dialog").then(
    (mod) => mod.StartImplementationDialog,
  ),
)
const CompleteProjectDialog = dynamic(() =>
  import("@/components/ui/dialogs/complete-project-dialog").then(
    (mod) => mod.CompleteProjectDialog,
  ),
)
const DeleteProjectRequestDialog = dynamic(() =>
  import("@/components/ui/dialogs/delete-project-request-dialog").then(
    (mod) => mod.DeleteProjectRequestDialog,
  ),
)
const CreateViolationDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-violation-dialog").then(
    (mod) => mod.CreateViolationDialog,
  ),
)
const EditViolationDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-violation-dialog").then(
    (mod) => mod.EditViolationDialog,
  ),
)
const CreateInspectionDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-inspection-dialog").then(
    (mod) => mod.CreateInspectionDialog,
  ),
)
const EditInspectionDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-inspection-dialog").then(
    (mod) => mod.EditInspectionDialog,
  ),
)
const SendEmailLockerRentDialog = dynamic(() =>
  import("@/components/ui/dialogs/send-email-locker-rent-dialog").then(
    (mod) => mod.SendEmailLockerRentDialog,
  ),
)
const EditWaterVendoDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-water-vendo-dialog").then(
    (mod) => mod.EditWaterVendoDialog,
  ),
)
const CreateWaterSupplyDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-water-supply-dialog").then(
    (mod) => mod.CreateWaterSupplyDialog,
  ),
)
const EditWaterSupplyDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-water-supply-dialog").then(
    (mod) => mod.EditWaterSupplyDialog,
  ),
)
const EditWaterFundDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-water-fund-dialog").then(
    (mod) => mod.EditWaterFundDialog,
  ),
)
const CreateExpenseDialog = dynamic(() =>
  import("@/components/ui/dialogs/create-expense-dialog").then(
    (mod) => mod.CreateExpenseDialog,
  ),
)
const ViewImageDialog = dynamic(() =>
  import("@/components/ui/dialogs/view-image-dialog").then(
    (mod) => mod.ViewImageDialog,
  ),
)
const EditExpenseDialog = dynamic(() =>
  import("@/components/ui/dialogs/edit-expense-dialog").then(
    (mod) => mod.EditExpenseDialog,
  ),
)

export const DialogProvider = () => {
  const isMounted = useMounted()
  if (!isMounted) return null

  return (
    <>
      <Suspense fallback={null}>
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
        <CreateViolationDialog />
        <EditViolationDialog />
        <CreateInspectionDialog />
        <EditInspectionDialog />
        <SendEmailLockerRentDialog />
        <EditWaterVendoDialog />
        <CreateWaterSupplyDialog />
        <EditWaterSupplyDialog />
        <EditWaterFundDialog />
        <CreateExpenseDialog />
        <ViewImageDialog />
        <EditExpenseDialog />
      </Suspense>
    </>
  )
}
