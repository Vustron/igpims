import { Card } from "@/components/ui/cards"
import { FaCheckCircle } from "react-icons/fa"

export const IgpStatus = () => {
  return (
    <Card className="col-span-2 bg-white p-6">
      <h3 className="mb-4 font-semibold text-lg">IGP Status</h3>
      <div className="mt-8 flex items-center gap-2">
        <FaCheckCircle className="text-green-500 text-xl" />
        <p>All Income Generating Projects are active</p>
      </div>
    </Card>
  )
}
