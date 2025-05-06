import { FaCheckCircle } from "react-icons/fa"
import { Card } from "@/components/ui/cards"

export const IgpStatus = () => {
  return (
    <Card className="col-span-full h-full w-full p-3 sm:col-span-2 sm:p-4 md:p-6 lg:col-span-1">
      <h3 className="mb-2 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        IGP Status
      </h3>
      <div className="mt-4 flex items-center gap-2 sm:mt-6 md:mt-8">
        <FaCheckCircle className="text-base text-green-500 sm:text-lg md:text-xl" />
        <p className="text-xs sm:text-sm md:text-base">
          All Income Generating Projects are active
        </p>
      </div>
    </Card>
  )
}
