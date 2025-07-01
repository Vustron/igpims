import { create } from "zustand"
import {
  Inspection,
  Locker,
  LockerRental,
  User,
  Violation,
  WaterVendo,
} from "@/backend/db/schemas"

export type DialogType =
  | "confirm"
  | "needVerifyUser"
  | "sessionExpired"
  | "createLocker"
  | "createRent"
  | "printRentalAgreementReceipt"
  | "printProfitLoss"
  | "printIgpFinancialReport"
  | "printDueOverduePayments"
  | "printIgpStatus"
  | "createWaterVendo"
  | "createWaterFund"
  | "createIgp"
  | "createFundRequest"
  | "createProjectRequest"
  | "createUser"
  | "reviewFundRequest"
  | "checkFunds"
  | "approveFundRequest"
  | "disburseFunds"
  | "receiveFunds"
  | "submitReceipt"
  | "validateExpense"
  | "rejectFundRequest"
  | "sendEmailLockerViolation"
  | "reviewProjectRequest"
  | "createResolution"
  | "approveProjectRequest"
  | "startImplementation"
  | "completeProject"
  | "deleteProjectRequest"
  | "deleteFundRequest"
  | "createViolation"
  | "editViolation"
  | "createInspection"
  | "editInspection"
  | "sendEmailLockerRent"
  | "editWaterVendo"

interface ConfirmDialogData {
  title?: string
  description?: string
  resolve?: (value: boolean) => void
}

interface FundRequestDialogData {
  requestId?: string
  currentStatus?: string
}

export interface ProjectRequestData {
  requestId?: string
}

interface RentalReceiptData {
  rental?: LockerRental
  locker?: Locker
  currentUser?: User
}

interface ViolationData {
  violation?: Violation
}

interface InspectionData {
  inspection?: Inspection
}

interface WaterVendoData {
  waterVendo?: WaterVendo
}

interface DialogStore {
  type: DialogType | null
  data: DialogData | null
  isOpen: boolean
  onOpen: (type: DialogType, data?: DialogData) => void
  onClose: () => void
}

export type DialogData =
  | ConfirmDialogData
  | FundRequestDialogData
  | ProjectRequestData
  | RentalReceiptData
  | ViolationData
  | InspectionData
  | WaterVendoData

export const isConfirmData = (
  data: DialogData | null,
): data is ConfirmDialogData => {
  return data !== null && "resolve" in data
}

export const isFundRequestData = (
  data: DialogData | null,
): data is FundRequestDialogData => {
  return data !== null && "requestId" in data
}

export const isProjectRequestData = (data: any): data is ProjectRequestData => {
  return data && typeof data.requestId === "string"
}

export const isRentalReceiptData = (data: any): data is RentalReceiptData => {
  return data && data.rental !== undefined
}

export const isViolationData = (data: any): data is ViolationData => {
  return data && data.violation !== undefined
}

export const isInspectionData = (data: any): data is InspectionData => {
  return data && data.inspection !== undefined
}

export const isWaterVendoData = (data: any): data is WaterVendoData => {
  return data && data.waterVendo !== undefined
}

export const useDialog = create<DialogStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data: data || null }),
  onClose: () => set({ type: null, data: null, isOpen: false }),
}))
