import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import { DynamicForm } from "@/components/ui/forms"
import { PiLockers } from "react-icons/pi"

import type { UseFormReturn } from "react-hook-form"
import type { FieldConfig } from "@/interfaces/form"
import type { Locker } from "@/validation/locker"

interface LockerConfigurationCardProps {
  form: UseFormReturn<Locker>
  fields: FieldConfig<Locker>[]
  onSubmit: (values: Locker) => Promise<void>
  mutation: any
}

export const LockerConfigurationCard = ({
  form,
  fields,
  onSubmit,
  mutation,
}: LockerConfigurationCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <PiLockers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Locker Configuration
            </CardTitle>
            <CardDescription className="text-sm">
              Manage locker information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <DynamicForm
          form={form}
          fields={fields}
          onSubmit={onSubmit}
          mutation={mutation}
          submitButtonTitle="Save Changes"
          addCancelButton
          twoColumnLayout={true}
        />
      </CardContent>
    </Card>
  )
}
