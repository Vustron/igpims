import { TailwindIndicator } from "@/components/context/tailwind-indicator"
import { ProgressBarProvider } from "@/components/context/progress-bar"
import { DialogProvider } from "@/components/context/dialog"
import { ThemeProvider } from "@/components/context/themes"
import { QueryProvider } from "@/components/context/query"
import { TooltipProvider } from "@/components/ui/tooltips"
import { ToastProvider } from "@/components/context/toast"

export const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <TooltipProvider disableHoverableContent>
        <QueryProvider>
          <ProgressBarProvider>
            <DialogProvider />
            <ToastProvider />
            {children}
          </ProgressBarProvider>
          <TailwindIndicator />
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
