import { genSalt, hash } from "bcrypt-ts"
import { config } from "dotenv"
import { nanoid } from "nanoid"
import { account, user } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"

config({ path: ".env.local" })

async function main() {
  try {
    const now = new Date()
    const userId = nanoid()
    const salt = await genSalt(10)
    const pepper = process.env.SECRET_KEY
    const pepperedPassword = `12345678${pepper}`
    const hashedPassword = await hash(pepperedPassword, salt)

    await db.transaction(async (tx) => {
      await Promise.all([
        tx.insert(user).values({
          id: userId,
          name: "SuperAdmin",
          email: "superadmin@admin.com",
          emailVerified: true,
          sessionExpired: false,
          role: "admin",
          createdAt: now,
          updatedAt: now,
        }),
        tx.insert(account).values({
          userId: userId,
          accountId: nanoid(),
          providerType: "credentials",
          password: hashedPassword,
          salt: salt,
          otpSignIn: false,
          createdAt: now,
          updatedAt: now,
        }),
      ])
      console.log("✅ Superadmin user created successfully")
    })
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error)
    process.exit(1)
  }
}

main()
