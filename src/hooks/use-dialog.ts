import { ExpenseTransactionWithRequestor } from "@/backend/actions/expense-transaction/find-many"
import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { IgpSupplyWithRelations } from "@/backend/actions/igp-supply/find-by-id"
import { IgpTransactionWithIgp } from "@/backend/actions/igp-transaction/find-many"
import { IgpWithProjectLeadData } from "@/backend/actions/igp/find-many"
import { PaginatedRentalsResponse } from "@/backend/actions/locker-rental/find-many"
import { ViolationWithRenters } from "@/backend/actions/violation/find-many"
import { WaterFundWithVendoLocation } from "@/backend/actions/water-fund/find-by-id"
import { WaterSupplyWithVendoLocation } from "@/backend/actions/water-supply/find-by-id"
import {
  Inspection,
  Locker,
  LockerRental,
  Session,
  User,
  WaterVendo,
} from "@/backend/db/schemas"
import { create } from "zustand"

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
  | "createWaterSupply"
  | "editWaterSupply"
  | "editWaterFund"
  | "createExpense"
  | "editExpense"
  | "viewImage"
  | "rejectReason"
  | "createIgpTransaction"
  | "editIgpTransaction"
  | "createIgpSupply"
  | "editIgpSupply"

interface ConfirmDialogData {
  title?: string
  description?: string
  resolve?: (value: boolean) => void
}

interface FundRequestDialogData {
  fundRequest?: FundRequestWithUser
  session?: Session
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
  violation?: ViolationWithRenters
  lockerRentalsData?: PaginatedRentalsResponse
}

interface InspectionData {
  inspection?: Inspection
}

interface WaterVendoData {
  waterVendo?: WaterVendo
}

interface WaterSupplyData {
  waterSupply?: WaterSupplyWithVendoLocation
}

interface WaterFundData {
  waterFund?: WaterFundWithVendoLocation
}

interface ExpenseTransactionData {
  expenseTransaction?: ExpenseTransactionWithRequestor
}

interface ViewImageData {
  imgUrl?: string
}

interface isRequestId {
  requestId?: string
}

interface IgpData {
  igp?: IgpWithProjectLeadData
}

interface IgpTransactionData {
  igpTransaction?: IgpTransactionWithIgp
}

interface IgpSupplyData {
  igpSupply?: IgpSupplyWithRelations
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
  | WaterSupplyData
  | WaterFundData
  | ExpenseTransactionData
  | ViewImageData
  | IgpData
  | IgpTransactionData
  | IgpSupplyData

export const isConfirmData = (
  data: DialogData | null,
): data is ConfirmDialogData => {
  return data !== null && "resolve" in data
}

export const isFundRequestData = (data: any): data is FundRequestDialogData => {
  return data && data.fundRequest !== undefined
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

export const isWaterSupplyData = (data: any): data is WaterSupplyData => {
  return data && data.waterSupply !== undefined
}

export const isWaterFundData = (data: any): data is WaterFundData => {
  return data && data.waterFund !== undefined
}

export const isViewImageData = (data: any): data is ViewImageData => {
  return data && data.imgUrl !== undefined
}

export const isExpenseTransactionData = (
  data: any,
): data is ExpenseTransactionData => {
  return data && data.expenseTransaction !== undefined
}

export const isRequestId = (data: any): data is isRequestId => {
  return data && typeof data.requestId === "string"
}

export const isIgpData = (data: any): data is IgpData => {
  return data && data.igp !== undefined
}

export const isIgpTransactionData = (data: any): data is IgpTransactionData => {
  return data && data.igpTransaction !== undefined
}

export const isIgpSupplyData = (data: any): data is IgpSupplyData => {
  return data && data.igpSupply !== undefined
}

export const useDialog = create<DialogStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data: data || null }),
  onClose: () => set({ type: null, data: null, isOpen: false }),
}))
