import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { cn } from "@/utils/cn"

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
}

export const SidebarToggle = ({ isOpen, setIsOpen }: SidebarToggleProps) => {
  return (
    <div className="-right-[16px] invisible absolute top-[12px] z-20 lg:visible ">
      <Button
        onClick={() => setIsOpen?.()}
        className="size-8 rounded-md border-none bg-[#2E2B16] text-white hover:bg-[#2E2B16]/80 hover:text-white"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "size-4 transition-transform duration-300 ease-in-out",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  )
}
