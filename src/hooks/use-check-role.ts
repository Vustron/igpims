import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface UserState {
  userRole: string
  setUserRole: (role: string) => void
  clearUserRole: () => void
}

export const useCheckRoleStore = create<UserState>()(
  persist(
    (set) => ({
      userRole: "",
      setUserRole: (role: string) => set({ userRole: role }),
      clearUserRole: () => set({ userRole: "" }),
    }),
    {
      name: "user-role-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userRole: state.userRole }),
    },
  ),
)
