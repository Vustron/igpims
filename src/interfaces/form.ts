import {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

export interface SelectOption {
  value: string
  label: string
}

export interface FormSection {
  id: string
  title: string
  description?: string
  defaultExpanded?: boolean
  className?: string
  titleClassName?: string
  contentClassName?: string
}

export interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "select"
    | "multiselect"
    | "image"
    | "textarea"
    | "file"
    | "switch"
    | "currency"
    | "date"
    | "dateRange"
  label: string
  placeholder: string
  className?: string
  options?: SelectOption[]
  defaultValues?: string[]
  description?: string
  hidden?: boolean
  required?: boolean
  section?: string
  minDate?: Date | string
  maxDate?: Date | string
  disabledDates?: Date[]
  span?: 1 | 2
}

export interface Mutation {
  isPending: boolean
}

export interface DynamicFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  fields: FieldConfig<TFieldValues>[]
  sections?: FormSection[]
  submitButtonTitle: string
  resetButtonTitle?: string
  mutation?: Mutation
  className?: string
  disabled?: boolean
  submitButtonClassname?: string
  submitButtonTitleClassname?: string
  onReset?: () => void
  isSignUp?: boolean
  isSignIn?: boolean
  isResetPassword?: boolean
  isOnEditAccount?: boolean
  isFloatingLabelInput?: boolean
  addCancelButton?: boolean
  twoColumnLayout?: boolean
}
