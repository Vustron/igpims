import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface OtpStore {
  isOtpSignIn: boolean
  toggleOtpSignIn: () => void
  resetOtpSignIn: () => void
}

export const useOtpStore = create<OtpStore>()(
  persist(
    (set) => ({
      isOtpSignIn: false,
      toggleOtpSignIn: () =>
        set((state) => ({ isOtpSignIn: !state.isOtpSignIn })),
      resetOtpSignIn: () => set({ isOtpSignIn: false }),
    }),
    {
      name: "otp-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isOtpSignIn: state.isOtpSignIn }),
    },
  ),
)
