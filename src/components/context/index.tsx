import { DialogProvider } from "@/components/context/dialog"
import { ProgressBarProvider } from "@/components/context/progress-bar"
import { QueryProvider } from "@/components/context/query"
import { TailwindIndicator } from "@/components/context/tailwind-indicator"
import { ThemeProvider } from "@/components/context/themes"
import { ToastProvider } from "@/components/context/toast"
import { TooltipProvider } from "@/components/ui/tooltips"

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
