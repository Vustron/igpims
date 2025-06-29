import { Locker, LockerRental } from "@/backend/db/schemas"

export interface LockerRentalWithLocker extends LockerRental {
  locker?: Locker
  sscOfficer: string
}
