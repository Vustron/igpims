import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary/70 text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        verified:
          "border-transparent bg-green-500/70 border-green-500 border-[2px] text-white hover:bg-green-600",
        unverified:
          "border-transparent bg-red-500/70 border-red-500 border-[2px] text-white hover:bg-red-600",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        purple:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        indigo:
          "border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        cyan: "border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
        teal: "border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200",
        amber:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        lime: "border-transparent bg-lime-100 text-lime-800 hover:bg-lime-200",
        rose: "border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200",
        "outline-success":
          "border-green-300 bg-green-50 text-green-800 hover:border-green-400 hover:bg-green-100",
        "outline-warning":
          "border-yellow-300 bg-yellow-50 text-yellow-800 hover:border-yellow-400 hover:bg-yellow-100",
        "outline-error":
          "border-red-300 bg-red-50 text-red-800 hover:border-red-400 hover:bg-red-100",
        "outline-info":
          "border-blue-300 bg-blue-50 text-blue-800 hover:border-blue-400 hover:bg-blue-100",
        new: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        premium:
          "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700",
        beta: "border-transparent bg-purple-600 text-white hover:bg-purple-700",
        required: "border-transparent bg-red-600 text-white hover:bg-red-700",
        pending:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        completed:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        // Refined subtle variants
        subtle:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
        "subtle-success":
          "border-transparent bg-green-50/70 text-green-800 hover:bg-green-100",
        "subtle-warning":
          "border-transparent bg-yellow-50/70 text-yellow-800 hover:bg-yellow-100",
        "subtle-error":
          "border-transparent bg-red-50/70 text-red-800 hover:bg-red-100",
        "subtle-info":
          "border-transparent bg-blue-50/70 text-blue-800 hover:bg-blue-100",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0 text-[10px]",
        lg: "px-2.5 py-1 text-sm",
      },
      rounded: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
)

function Badge({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, rounded }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
