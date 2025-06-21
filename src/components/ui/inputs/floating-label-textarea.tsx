import { TextareaHTMLAttributes } from "react"
import { Textarea } from "@/components/ui/inputs"
import { cn } from "@/utils/cn"

interface FloatingLabelTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hasErrors?: boolean
}

const FloatingLabelTextArea = ({
  label,
  hasErrors,
  className,
  ...props
}: FloatingLabelTextAreaProps) => {
  return (
    <div className="group relative w-full">
      <label
        htmlFor={props.id}
        className={cn(
          "group-focus-within:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 absolute top-0 block origin-start translate-y-2 cursor-text px-1 text-muted-foreground/70 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:cursor-default group-focus-within:font-medium group-focus-within:text-foreground group-focus-within:text-xs has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground has-[+textarea:not(:placeholder-shown)]:text-xs",
          hasErrors && "text-red-500",
        )}
      >
        <span className="inline-flex bg-background px-2">{label}</span>
      </label>
      <Textarea
        className={cn(
          hasErrors && "border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
    </div>
  )
}

export { FloatingLabelTextArea }
