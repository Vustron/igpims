import { eq, sql } from "drizzle-orm"
import { db } from "@/config/drizzle"
import { waterVendo } from "../db/schemas"

const getWaterVendoByIdQuery = db
  .select({
    id: waterVendo.id,
    waterVendoLocation: waterVendo.waterVendoLocation,
    gallonsUsed: waterVendo.gallonsUsed,
    vendoStatus: waterVendo.vendoStatus,
    waterRefillStatus: waterVendo.waterRefillStatus,
    createdAt: sql<number>`${waterVendo.createdAt}`,
    updatedAt: sql<number>`${waterVendo.updatedAt}`,
  })
  .from(waterVendo)
  .where(eq(waterVendo.id, sql.placeholder("id")))
  .prepare()

const getWaterVendoByLocationQuery = db.query.waterVendo
  .findFirst({
    where: (vendo, { eq }) =>
      eq(vendo.waterVendoLocation, sql.placeholder("waterVendoLocation")),
  })
  .prepare()

const createWaterVendoQuery = db
  .insert(waterVendo)
  .values({
    id: sql`${sql.placeholder("id")}`,
    waterVendoLocation: sql`${sql.placeholder("waterVendoLocation")}`,
    gallonsUsed: sql`${sql.placeholder("gallonsUsed")}`,
    vendoStatus: sql`${sql.placeholder("vendoStatus")}`,
    waterRefillStatus: sql`${sql.placeholder("waterRefillStatus")}`,
  })
  .returning()
  .prepare()

export {
  getWaterVendoByIdQuery,
  createWaterVendoQuery,
  getWaterVendoByLocationQuery,
}
