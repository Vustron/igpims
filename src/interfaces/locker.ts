import type { Locker, LockerRental } from "@/schemas/drizzle-schema"

export interface LockerRentalWithLocker extends LockerRental {
  locker?: Locker
}
