// types
import type {
  Path,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

/* SelectOption Type */
export interface SelectOption {
  value: string
  label: string
}

/* FormSection Type */
export interface FormSection {
  id: string
  title: string
  description?: string
  defaultExpanded?: boolean
  className?: string
  titleClassName?: string
  contentClassName?: string
}

/* FieldConfig Type */
export interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "select"
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
  description?: string
  hidden?: boolean
  required?: boolean
  section?: string
  minDate?: Date | string
  maxDate?: Date | string
  disabledDates?: Date[]
  span?: 1 | 2
}

/* Mutation Type */
export interface Mutation {
  isPending: boolean
}

/* DynamicFormProps Type */
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
