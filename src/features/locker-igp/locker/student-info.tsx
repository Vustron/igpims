import { CreditCard, User } from "lucide-react"
import { InfoItem } from "./info-item"

interface StudentInformationProps {
  rental: any
}

export const StudentInformation = ({ rental }: StudentInformationProps) => {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
        <User className="h-4 w-4" />
        Student Information
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoItem
          label="Full Name"
          value={rental.renterName}
          icon={<User className="h-3 w-3" />}
        />
        <InfoItem
          label="Student ID"
          value={rental.renterId}
          icon={<CreditCard className="h-3 w-3" />}
        />
        <InfoItem
          label="Course & Set"
          value={rental.courseAndSet}
          className="sm:col-span-2"
        />
        <InfoItem
          label="Email Address"
          value={rental.renterEmail || "Not provided"}
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}
