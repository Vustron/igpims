import { format } from "date-fns"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/buttons"
import { Calendar } from "@/components/ui/calendars"
import { FormLabel, PasswordStrengthMeter } from "@/components/ui/forms"
import {
  FileUpload,
  FloatingLabel,
  FloatingLabelAmountInput,
  FloatingLabelInput,
  FloatingLabelTextArea,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Switch,
} from "@/components/ui/inputs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import { FloatingSelect, Multiselect } from "@/components/ui/selects"
import { useOtpStore } from "@/hooks/use-otp-store"
import { FieldConfig, Mutation } from "@/interfaces/form"
import { cn } from "@/utils/cn"

interface FormControlRendererProps<TFieldValues extends FieldValues> {
  field: FieldConfig<TFieldValues>
  formField: any
  form: UseFormReturn<TFieldValues>
  mutation: Mutation
  disabled: boolean
  isSignUp?: boolean
  isFloatingLabel?: boolean
  onPasswordStrengthChange?: (isStrong: boolean) => void
  isOnAuth?: boolean
}

export const FormControlRenderer = <TFieldValues extends FieldValues>({
  field,
  formField,
  form,
  mutation,
  disabled,
  isSignUp,
  isFloatingLabel = true,
  onPasswordStrengthChange,
}: FormControlRendererProps<TFieldValues>) => {
  const isOtpSignIn = useOtpStore((state) => state.isOtpSignIn)

  switch (field.type) {
    case "select":
      return (
        <FloatingSelect
          options={field.options || []}
          label={field.label}
          placeholder={field.placeholder}
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          value={formField.value}
          disabled={mutation?.isPending || disabled}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "textarea":
      return (
        <FloatingLabelTextArea
          {...formField}
          id={field.name}
          label={field.label}
          placeholder={field.placeholder}
          disabled={mutation?.isPending || disabled}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "switch":
      return (
        <div className="container space-y-2 rounded-lg border p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel
                htmlFor={field.name}
                className="font-medium text-sm leading-none"
              >
                {field.label}
              </FormLabel>
              {field.description && (
                <p className="text-muted-foreground text-xs">
                  {field.description}
                </p>
              )}
            </div>
            <Switch
              id={field.name}
              checked={formField.value}
              onCheckedChange={(checked) => {
                formField.onChange(checked)
              }}
              disabled={mutation?.isPending || disabled}
            />
          </div>
        </div>
      )

    case "file":
    case "image":
      return (
        <FileUpload
          onChange={(files) => formField.onChange(files[0])}
          value={formField.value}
          label={field.label}
          hasErrors={!!form.formState.errors[field.name]}
          className={cn(
            "w-full",
            form.formState.errors[field.name]
              ? "border-red-600 focus:ring-0"
              : "",
            field.className,
          )}
        />
      )

    case "date":
      return (
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "peer h-12 w-full justify-start text-left font-normal",
                    !formField.value && "text-transparent",
                    form.formState.errors[field.name]
                      ? "border-red-600 focus:ring-0"
                      : "",
                    field.className,
                  )}
                  disabled={mutation?.isPending || disabled}
                >
                  {formField.value ? (
                    <span className="text-foreground">
                      {format(new Date(formField.value), "PPP")}
                    </span>
                  ) : (
                    <span className="opacity-0">placeholder</span>
                  )}
                </Button>
                <FloatingLabel
                  htmlFor={field.name}
                  hasErrors={!!form.formState.errors[field.name]}
                  className={cn(
                    "z-10",
                    formField.value ? "-translate-y-4 scale-75" : "",
                  )}
                >
                  {field.label}
                </FloatingLabel>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formField.value ? new Date(formField.value) : undefined
                }
                onSelect={(date) => {
                  formField.onChange(date || undefined)
                }}
                disabled={(date) => {
                  if (field.minDate && date < new Date(field.minDate))
                    return true
                  if (field.maxDate && date > new Date(field.maxDate))
                    return true
                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {field.description && (
            <p className="mt-1 text-muted-foreground text-xs">
              {field.description}
            </p>
          )}
        </div>
      )

    case "dateRange":
      return (
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "peer h-12 w-full justify-start text-left font-normal",
                    !formField.value?.from && "text-transparent",
                    form.formState.errors[field.name]
                      ? "border-red-600 focus:ring-0"
                      : "",
                    field.className,
                  )}
                  disabled={mutation?.isPending || disabled}
                >
                  {formField.value?.from ? (
                    <span className="text-foreground">
                      {formField.value.to ? (
                        <>
                          {format(new Date(formField.value.from), "PPP")} -{" "}
                          {format(new Date(formField.value.to), "PPP")}
                        </>
                      ) : (
                        format(new Date(formField.value.from), "PPP")
                      )}
                    </span>
                  ) : (
                    <span className="opacity-0">placeholder</span>
                  )}
                </Button>
                <FloatingLabel
                  htmlFor={field.name}
                  hasErrors={!!form.formState.errors[field.name]}
                  className={cn(
                    "z-10",
                    formField.value?.from ? "-translate-y-4 scale-75" : "",
                  )}
                >
                  {field.label}
                </FloatingLabel>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={
                  formField.value
                    ? {
                        from: formField.value.from
                          ? new Date(formField.value.from)
                          : undefined,
                        to: formField.value.to
                          ? new Date(formField.value.to)
                          : undefined,
                      }
                    : undefined
                }
                onSelect={(range) => {
                  formField.onChange(range)
                }}
                disabled={(date) => {
                  if (field.minDate && date < new Date(field.minDate))
                    return true
                  if (field.maxDate && date > new Date(field.maxDate))
                    return true
                  return false
                }}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {field.description && (
            <p className="mt-1 text-muted-foreground text-xs">
              {field.description}
            </p>
          )}
        </div>
      )
    case "text":
    case "password":
    case "email":
    case "number":
      if (field.type === "password" && !isSignUp && isOtpSignIn) {
        return (
          <InputOTP
            maxLength={6}
            value={formField.value || ""}
            onChange={(value) => formField.onChange(value)}
            disabled={mutation?.isPending}
            containerClassName="w-full ml-10"
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, idx) => (
                  <InputOTPSlot
                    key={idx}
                    {...slot}
                    className={cn(
                      form.formState.errors[field.name]
                        ? "border-red-600 focus:ring-0"
                        : "",
                      field.className,
                    )}
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        )
      }

      return (
        <>
          {!isOtpSignIn && (
            <>
              {isFloatingLabel ? (
                <FloatingLabelInput
                  {...formField}
                  id={field.name}
                  type={field.type}
                  label={field.label}
                  placeholder={isOtpSignIn ? field.placeholder : null}
                  disabled={mutation?.isPending}
                  hasErrors={!!form.formState.errors[field.name]}
                  className={cn(
                    "w-full",
                    form.formState.errors[field.name]
                      ? "border-red-600 focus:ring-0"
                      : "space-y-10",
                    field.className,
                  )}
                  isPassword={field.type === "password"}
                />
              ) : (
                <div className="space-y-2">
                  {field.label && (
                    <FormLabel
                      htmlFor={field.name}
                      className="font-medium text-sm text-white"
                    >
                      {field.label}
                    </FormLabel>
                  )}
                  <Input
                    {...formField}
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={mutation?.isPending || disabled}
                    className={cn(
                      "w-full",
                      form.formState.errors[field.name]
                        ? "border-red-600 focus:ring-0"
                        : "",
                      field.className,
                    )}
                    aria-invalid={!!form.formState.errors[field.name]}
                    isPassword={field.type === "password"}
                  />
                </div>
              )}

              {((isSignUp && field.type === "password") ||
                (field.type === "password" &&
                  field.name === "newPassword")) && (
                <PasswordStrengthMeter
                  password={formField.value}
                  onStrengthChange={onPasswordStrengthChange}
                />
              )}
            </>
          )}
        </>
      )

    case "multiselect":
      return (
        <div className="relative">
          <Multiselect
            options={field.options || []}
            value={formField.value || []}
            onChange={formField.onChange}
            placeholder={field.placeholder}
            hasErrors={!!form.formState.errors[field.name]}
            disabled={mutation?.isPending || disabled}
            className={cn("peer pt-5", field.className)}
          />
          <FloatingLabel
            htmlFor={field.name}
            hasErrors={!!form.formState.errors[field.name]}
            className={cn(
              "z-10",
              formField.value && formField.value.length > 0
                ? "-translate-y-3 scale-75"
                : "",
            )}
          >
            {field.label}
          </FloatingLabel>
        </div>
      )

    case "currency":
      return (
        <FloatingLabelAmountInput
          id={field.name.toString()}
          label={field.label}
          value={formField.value}
          onChange={(value: any) => {
            const numValue = value === "" ? 0 : Number.parseFloat(value)
            formField.onChange(numValue)
          }}
          placeholder={field.placeholder}
          hasErrors={!!form.formState.errors[field.name]}
          disabled={mutation?.isPending || disabled}
          className={cn(
            form.formState.errors[field.name] ? "border-red-600" : "",
            field.className,
          )}
        />
      )

    default:
      return null
  }
}
