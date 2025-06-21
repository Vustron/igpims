import { DataTable } from "@/components/ui/tables"
import {
  exampleWaterSupplies,
  waterSupplyListColumn,
} from "./water-supply-column"

export const WaterSupply = () => {
  return (
    <DataTable
      columns={waterSupplyListColumn}
      data={exampleWaterSupplies}
      placeholder="Search..."
    />
  )
}
