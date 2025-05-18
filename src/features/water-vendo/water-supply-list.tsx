import {
  exampleWaterSupplies,
  waterSupplyListColumn,
} from "@/features/water-vendo/water-supply-column"
import { DataTable } from "@/components/ui/tables"

export const WaterSupply = () => {
  return (
    <DataTable
      columns={waterSupplyListColumn}
      data={exampleWaterSupplies}
      placeholder="Search..."
    />
  )
}
