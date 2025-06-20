import type { Locker, LockerRental } from "@/backend/db/schemas"

export interface LockerRentalWithLocker extends LockerRental {
  locker?: Locker
}
