import { text, index, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { user } from "./user"

import type { InferSelectModel } from "drizzle-orm"

export const locker = sqliteTable(
  "locker",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    lockerStatus: text("lockerStatus", { length: 20 })
      .notNull()
      .default("available")
      .$type<
        "available" | "occupied" | "reserved" | "maintenance" | "out-of-service"
      >(),
    lockerType: text("lockerType", { length: 255 }).notNull(),
    lockerName: text("lockerName", { length: 255 }).notNull(),
    lockerLocation: text("lockerLocation", { length: 255 }).notNull(),
    lockerRentalPrice: integer("lockerRentalPrice").default(0).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("locker_type_idx").on(t.lockerType),
    index("locker_status_idx").on(t.lockerStatus),
    index("locker_rental_price_idx").on(t.lockerRentalPrice),
  ],
)

export const lockerRental = sqliteTable(
  "lockerRental",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    lockerId: text("lockerId")
      .notNull()
      .references(() => locker.id, { onDelete: "restrict" }),
    renterId: text("renterId").notNull(),
    renterName: text("renterName", { length: 100 }).notNull(),
    courseAndSet: text("courseAndSet", { length: 100 }).notNull(),
    renterEmail: text("renterEmail", { length: 100 }).notNull(),
    rentalStatus: text("rentalStatus", { length: 100 }).notNull(),
    paymentStatus: text("paymentStatus", { length: 100 }).notNull(),
    dateRented: integer("dateRented", { mode: "timestamp" }).notNull(),
    dateDue: integer("dateDue", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("lockerRental_locker_id_idx").on(t.lockerId),
    index("lockerRental_renter_id_idx").on(t.renterId),
    index("lockerRental_status_idx").on(t.rentalStatus),
    index("lockerRental_payment_status_idx").on(t.paymentStatus),
    index("lockerRental_date_due_idx").on(t.dateDue),
  ],
)

export const lockerRelations = relations(locker, ({ many }) => ({
  rentals: many(lockerRental),
}))

export const lockerRentalRelations = relations(lockerRental, ({ one }) => ({
  locker: one(locker, {
    fields: [lockerRental.lockerId],
    references: [locker.id],
  }),
  renter: one(user, {
    fields: [lockerRental.renterId],
    references: [user.id],
  }),
}))

export type Locker = InferSelectModel<typeof locker>
export type LockerRental = InferSelectModel<typeof lockerRental>
