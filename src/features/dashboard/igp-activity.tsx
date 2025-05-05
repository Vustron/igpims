import { GiLockers, GiDroplets, GiClothes } from "react-icons/gi"
import { Card } from "@/components/ui/cards"

export const IgpActivity = () => {
  return (
    <Card className="col-span-2 p-6">
      <h3 className="mb-4 font-semibold text-lg">IGP Activity</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <GiLockers className="text-2xl text-gray-600" />
          <div>
            <p className="font-medium">Locker - 1 locker rented per semester</p>
            <p className="text-muted-foreground text-sm">
              ₱ 150 for Large and ₱100 for small
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GiDroplets className="text-2xl text-gray-600" />
          <div>
            <p className="font-medium">Water Vendo - 15 Gallons sold</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GiClothes className="text-2xl text-gray-600" />
          <div>
            <p className="font-medium">Merchandise - T-shirt sales</p>
            <p className="text-muted-foreground text-sm">₱ 5,300</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
