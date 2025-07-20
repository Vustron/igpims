import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"
import { igp, igpSupply, igpTransactions, user } from "../db/schemas"

const insertIgpTransactionQuery = db
  .insert(igpTransactions)
  .values({
    id: sql`${sql.placeholder("id")}`,
    igpId: sql`${sql.placeholder("igpId")}`,
    igpSupplyId: sql`${sql.placeholder("igpSupplyId")}`,
    purchaserName: sql`${sql.placeholder("purchaserName")}`,
    courseAndSet: sql`${sql.placeholder("courseAndSet")}`,
    batch: sql`${sql.placeholder("batch")}`,
    quantity: sql`${sql.placeholder("quantity")}`,
    dateBought: sql`${sql.placeholder("dateBought")}`,
    itemReceived: sql`${sql.placeholder("itemReceived")}`,
  })
  .returning()
  .prepare()

const findIgpTransactionByIdQuery = db
  .select({
    id: igpTransactions.id,
    igpId: igpTransactions.igpId,
    igpSupplyId: igpTransactions.igpSupplyId,
    purchaserName: igpTransactions.purchaserName,
    courseAndSet: igpTransactions.courseAndSet,
    batch: igpTransactions.batch,
    quantity: igpTransactions.quantity,
    dateBought: sql<number>`${igpTransactions.dateBought}`,
    itemReceived: igpTransactions.itemReceived,
    createdAt: sql<number>`${igpTransactions.createdAt}`,
    updatedAt: sql<number>`${igpTransactions.updatedAt}`,
    igpData: {
      id: igp.id,
      igpName: igp.igpName,
      costPerItem: igp.costPerItem,
    },
    supplyData: {
      id: igpSupply.id,
      quantity: igpSupply.quantity,
      quantitySold: igpSupply.quantitySold,
      unitPrice: igpSupply.unitPrice,
      expenses: igpSupply.expenses,
      totalRevenue: igpSupply.totalRevenue,
    },
  })
  .from(igpTransactions)
  .leftJoin(igp, eq(igpTransactions.igpId, igp.id))
  .leftJoin(igpSupply, eq(igpTransactions.igpSupplyId, igpSupply.id))
  .where(eq(igpTransactions.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const findIgpTransactionByIdWithIgpQuery = db
  .select({
    id: igpTransactions.id,
    igpId: igpTransactions.igpId,
    igpSupplyId: igpTransactions.igpSupplyId,
    purchaserName: igpTransactions.purchaserName,
    courseAndSet: igpTransactions.courseAndSet,
    batch: igpTransactions.batch,
    quantity: igpTransactions.quantity,
    dateBought: sql<number>`${igpTransactions.dateBought}`,
    itemReceived: igpTransactions.itemReceived,
    createdAt: sql<number>`${igpTransactions.createdAt}`,
    updatedAt: sql<number>`${igpTransactions.updatedAt}`,
    igp: {
      id: igp.id,
      igpName: igp.igpName,
      costPerItem: igp.costPerItem,
    },
    supply: {
      id: igpSupply.id,
      supplyDate: sql<number>`${igpSupply.supplyDate}`,
      quantity: igpSupply.quantity,
      quantitySold: igpSupply.quantitySold,
      unitPrice: igpSupply.unitPrice,
      expenses: igpSupply.expenses,
      totalRevenue: igpSupply.totalRevenue,
    },
    totalAmount: sql<number>`${igpTransactions.quantity} * ${igp.costPerItem}`,
  })
  .from(igpTransactions)
  .leftJoin(igp, eq(igpTransactions.igpId, igp.id))
  .leftJoin(igpSupply, eq(igpTransactions.igpSupplyId, igpSupply.id))
  .leftJoin(user, eq(igp.projectLead, user.id))
  .where(eq(igpTransactions.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

export {
  insertIgpTransactionQuery,
  findIgpTransactionByIdQuery,
  findIgpTransactionByIdWithIgpQuery,
}
