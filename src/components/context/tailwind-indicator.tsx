import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"

export const TailwindIndicator = () => {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div className="fixed bottom-15 left-6 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-white text-xs">
          <div className="block sm:hidden">xs</div>
          <div className="hidden sm:block md:hidden">sm</div>
          <div className="hidden md:block lg:hidden">md</div>
          <div className="hidden lg:block xl:hidden">lg</div>
          <div className="hidden xl:block 2xl:hidden">xl</div>
          <div className="hidden 2xl:block">2xl</div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="block sm:hidden">Extra Small (xs): &lt;640px</div>
        <div className="hidden sm:block md:hidden">Small (sm): 640px-768px</div>
        <div className="hidden md:block lg:hidden">
          Medium (md): 768px-1024px
        </div>
        <div className="hidden lg:block xl:hidden">
          Large (lg): 1024px-1280px
        </div>
        <div className="hidden xl:block 2xl:hidden">
          Extra Large (xl): 1280px-1536px
        </div>
        <div className="hidden 2xl:block">2x Extra Large (2xl): &gt;1536px</div>
      </TooltipContent>
    </Tooltip>
  )
}
