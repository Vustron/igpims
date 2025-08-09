import { TooltipProvider } from "@/components/ui/tooltips"
import { DialogProvider } from "./dialog"
import { ImagekitProviderContext } from "./imagekit"
import { PostHogProvider } from "./posthog"
import { ProgressBarProvider } from "./progress-bar"
import { QueryProvider } from "./query"
import { TailwindIndicator } from "./tailwind-indicator"
import { ThemeProvider } from "./themes"
import { ToastProvider } from "./toast"

export const Contexts = ({ children }: { children: React.ReactNode }) => {
  return (
    <PostHogProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider disableHoverableContent>
          <QueryProvider>
            <ProgressBarProvider>
              <ImagekitProviderContext>
                <DialogProvider />
                <ToastProvider />
                {children}
              </ImagekitProviderContext>
            </ProgressBarProvider>
            <TailwindIndicator />
          </QueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </PostHogProvider>
  )
}
