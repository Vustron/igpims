import { eq, sql } from "drizzle-orm"
import { db } from "@/config/drizzle"
import { waterFunds, waterVendo } from "../db/schemas"

const createWaterFundQuery = db
  .insert(waterFunds)
  .values({
    id: sql`${sql.placeholder("id")}`,
    waterVendoId: sql`${sql.placeholder("waterVendoId")}`,
    waterVendoLocation: sql`${sql.placeholder("waterVendoLocation")}`,
    usedGallons: sql`${sql.placeholder("usedGallons")}`,
    waterFundsExpenses: sql`${sql.placeholder("waterFundsExpenses")}`,
    waterFundsRevenue: sql`${sql.placeholder("waterFundsRevenue")}`,
    waterFundsProfit: sql`${sql.placeholder("waterFundsProfit")}`,
    weekFund: sql`${sql.placeholder("weekFund")}`,
    dateFund: sql`${sql.placeholder("dateFund")}`,
  })
  .returning()
  .prepare()

const getWaterFundByIdQuery = db
  .select({
    id: waterFunds.id,
    waterVendoId: waterFunds.waterVendoId,
    waterVendoLocation: waterFunds.waterVendoLocation,
    usedGallons: waterFunds.usedGallons,
    waterFundsExpenses: waterFunds.waterFundsExpenses,
    waterFundsRevenue: waterFunds.waterFundsRevenue,
    waterFundsProfit: waterFunds.waterFundsProfit,
    weekFund: sql<number>`${waterFunds.weekFund}`,
    dateFund: sql<number>`${waterFunds.dateFund}`,
    createdAt: sql<number>`${waterFunds.createdAt}`,
    updatedAt: sql<number>`${waterFunds.updatedAt}`,
    vendoLocation: waterVendo.waterVendoLocation,
  })
  .from(waterFunds)
  .leftJoin(waterVendo, eq(waterFunds.waterVendoId, waterVendo.id))
  .where(eq(waterFunds.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const getWaterFundByWeekQuery = db
  .select({
    id: waterFunds.id,
    waterVendoId: waterFunds.waterVendoId,
    weekFund: waterFunds.weekFund,
  })
  .from(waterFunds)
  .where(
    sql`${waterFunds.waterVendoId} = ${sql.placeholder("waterVendoId")} 
    AND DATE(${waterFunds.weekFund}/1000, 'unixepoch') = DATE(${sql.placeholder("weekFund")}/1000, 'unixepoch')`,
  )
  .limit(1)
  .prepare()

export { createWaterFundQuery, getWaterFundByIdQuery, getWaterFundByWeekQuery }
