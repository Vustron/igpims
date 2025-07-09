import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"
import { waterSupply, waterVendo } from "../db/schemas"

const createWaterSupplyQuery = db
  .insert(waterSupply)
  .values({
    id: sql`${sql.placeholder("id")}`,
    waterVendoId: sql`${sql.placeholder("waterVendoId")}`,
    supplyDate: sql`${sql.placeholder("supplyDate")}`,
    suppliedGallons: sql`${sql.placeholder("suppliedGallons")}`,
    expenses: sql`${sql.placeholder("expenses")}`,
    usedGallons: sql`${sql.placeholder("usedGallons")}`,
    remainingGallons: sql`${sql.placeholder("remainingGallons")}`,
  })
  .returning()
  .prepare()

const getWaterVendoByIdQuery = db
  .select({
    id: waterVendo.id,
    gallonsUsed: waterVendo.gallonsUsed,
    waterVendoLocation: waterVendo.waterVendoLocation,
  })
  .from(waterVendo)
  .where(eq(waterVendo.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const getWaterSupplyByDateQuery = db
  .select({
    id: waterSupply.id,
    waterVendoId: waterSupply.waterVendoId,
    supplyDate: waterSupply.supplyDate,
    expenses: waterSupply.expenses,
  })
  .from(waterSupply)
  .where(
    sql`${waterSupply.waterVendoId} = ${sql.placeholder("waterVendoId")} 
    AND ${waterSupply.supplyDate} = ${sql.placeholder("supplyDate")}`,
  )
  .limit(1)
  .prepare()

const getWaterSupplyByDateRangeQuery = db
  .select({
    id: waterSupply.id,
    waterVendoId: waterSupply.waterVendoId,
    supplyDate: waterSupply.supplyDate,
    expenses: waterSupply.expenses,
  })
  .from(waterSupply)
  .where(
    sql`${waterSupply.waterVendoId} = ${sql.placeholder("waterVendoId")} 
    AND DATE(${waterSupply.supplyDate}/1000, 'unixepoch') = DATE(${sql.placeholder("date")}/1000, 'unixepoch')`,
  )
  .limit(1)
  .prepare()

const getWaterSupplyByIdQuery = db
  .select({
    id: waterSupply.id,
    waterVendoId: waterSupply.waterVendoId,
    supplyDate: sql<number>`${waterSupply.supplyDate}`,
    suppliedGallons: waterSupply.suppliedGallons,
    expenses: waterSupply.expenses,
    usedGallons: waterSupply.usedGallons,
    remainingGallons: waterSupply.remainingGallons,
    createdAt: sql<number>`${waterSupply.createdAt}`,
    updatedAt: sql<number>`${waterSupply.updatedAt}`,
    vendoLocation: waterVendo.waterVendoLocation,
  })
  .from(waterSupply)
  .leftJoin(waterVendo, eq(waterSupply.waterVendoId, waterVendo.id))
  .where(eq(waterSupply.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const getWaterSupplyByWaterVendoIdQuery = db
  .select({
    id: waterSupply.id,
    waterVendoId: waterSupply.waterVendoId,
    supplyDate: sql<number>`${waterSupply.supplyDate}`,
    suppliedGallons: waterSupply.suppliedGallons,
    expenses: waterSupply.expenses,
    usedGallons: waterSupply.usedGallons,
    remainingGallons: waterSupply.remainingGallons,
    createdAt: sql<number>`${waterSupply.createdAt}`,
    updatedAt: sql<number>`${waterSupply.updatedAt}`,
    vendoLocation: waterVendo.waterVendoLocation,
  })
  .from(waterSupply)
  .leftJoin(waterVendo, eq(waterSupply.waterVendoId, waterVendo.id))
  .where(eq(waterSupply.waterVendoId, sql.placeholder("waterVendoId")))
  .prepare()

export {
  createWaterSupplyQuery,
  getWaterVendoByIdQuery,
  getWaterSupplyByDateQuery,
  getWaterSupplyByIdQuery,
  getWaterSupplyByDateRangeQuery,
  getWaterSupplyByWaterVendoIdQuery,
}
