import { create } from "zustand"

export type DialogType =
  | "confirm"
  | "needVerifyUser"
  | "sessionExpired"
  | "createLocker"
  | "printRentalAgreementReceipt"
  | "createWaterVendo"
  | "createWaterFund"
  | "createIgp"
  | "createFundRequest"

interface ConfirmDialogData {
  title?: string
  description?: string
  resolve?: (value: boolean) => void
}

interface DialogStore {
  type: DialogType | null
  data: DialogData | null
  isOpen: boolean
  onOpen: (type: DialogType, data?: DialogData) => void
  onClose: () => void
}

type DialogData = ConfirmDialogData

export const isConfirmData = (
  data: DialogData | null,
): data is ConfirmDialogData => {
  return data !== null && "resolve" in data
}

export const useDialog = create<DialogStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data: data || null }),
  onClose: () => set({ type: null, data: null, isOpen: false }),
}))
