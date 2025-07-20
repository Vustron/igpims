import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"
import { igp, igpSupply } from "../db/schemas"

const insertIgpSupplyQuery = db
  .insert(igpSupply)
  .values({
    id: sql`${sql.placeholder("id")}`,
    igpId: sql`${sql.placeholder("igpId")}`,
    supplyDate: sql`${sql.placeholder("supplyDate")}`,
    quantity: sql`${sql.placeholder("quantity")}`,
    quantitySold: sql`${sql.placeholder("quantitySold")}`,
    unitPrice: sql`${sql.placeholder("unitPrice")}`,
    expenses: sql`${sql.placeholder("expenses")}`,
    totalRevenue: sql`${sql.placeholder("totalRevenue")}`,
  })
  .returning()
  .prepare()

const findIgpSupplyByIdWithIgpQuery = db
  .select({
    id: igpSupply.id,
    igpId: igpSupply.igpId,
    supplyDate: sql<number>`${igpSupply.supplyDate}`,
    quantity: igpSupply.quantity,
    quantitySold: igpSupply.quantitySold,
    unitPrice: igpSupply.unitPrice,
    expenses: igpSupply.expenses,
    totalRevenue: igpSupply.totalRevenue,
    createdAt: sql<number>`${igpSupply.createdAt}`,
    updatedAt: sql<number>`${igpSupply.updatedAt}`,
    igp: {
      id: igp.id,
      igpName: igp.igpName,
      igpType: igp.igpType,
      costPerItem: igp.costPerItem,
    },
  })
  .from(igpSupply)
  .leftJoin(igp, eq(igpSupply.igpId, igp.id))
  .where(eq(igpSupply.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

export { insertIgpSupplyQuery, findIgpSupplyByIdWithIgpQuery }
