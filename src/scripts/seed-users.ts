import { account, user } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { genSalt, hash } from "bcrypt-ts"
import { config } from "dotenv"
import { nanoid } from "nanoid"

config({ path: ".env.local" })

async function main() {
  try {
    const now = new Date()
    const salt = await genSalt(10)
    const pepper = process.env.SECRET_KEY
    const pepperedPassword = `12345678${pepper}`
    const hashedPassword = await hash(pepperedPassword, salt)

    await db.transaction(async (tx) => {
      const userCreationPromises = [
        createUserWithAccount(tx, {
          name: "DebugAdmin",
          email: "debugadmin@admin.com",
          role: "admin",
        }),
        createUserWithAccount(tx, {
          name: "SSC Adviser",
          email: "sscadviser@email.com",
          role: "admin",
        }),
        createUserWithAccount(tx, {
          name: "SSC President",
          email: "sscpresident@email.com",
          role: "ssc_president",
        }),
        createUserWithAccount(tx, {
          name: "DPDM Secretary",
          email: "dpdmsecretary@email.com",
          role: "dpdm_secretary",
        }),
        createUserWithAccount(tx, {
          name: "DPDM Officer",
          email: "dpdmofficer@email.com",
          role: "dpdm_officers",
        }),
        createUserWithAccount(tx, {
          name: "SSC Treasurer",
          email: "ssc_treasurer@email.com",
          role: "ssc_treasurer",
        }),
        createUserWithAccount(tx, {
          name: "SSC Auditor",
          email: "ssc_auditor@email.com",
          role: "ssc_auditor",
        }),
        createUserWithAccount(tx, {
          name: "Chief Legislator",
          email: "chief_legislator@email.com",
          role: "chief_legislator",
        }),
        createUserWithAccount(tx, {
          name: "Legislative Secretary",
          email: "legislative_secretary@email.com",
          role: "legislative_secretary",
        }),
        createUserWithAccount(tx, {
          name: "SSC Officer",
          email: "ssc_officer@email.com",
          role: "ssc_officer",
        }),
        createUserWithAccount(tx, {
          name: "Student",
          email: "student@email.com",
          role: "student",
        }),
      ]

      await Promise.all(userCreationPromises)
      console.log("✅ Users created successfully")
    })

    async function createUserWithAccount(
      tx: any,
      userData: {
        name: string
        email: string
        role: string
      },
    ) {
      const userResult = await tx
        .insert(user)
        .values({
          id: nanoid(15),
          name: userData.name,
          email: userData.email,
          emailVerified: true,
          sessionExpired: false,
          role: userData.role,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ userId: user.id })

      if (!userResult || !userResult[0]) {
        throw new Error(`Failed to create user: ${userData.name}`)
      }

      const userId = userResult[0].userId

      await tx.insert(account).values({
        userId: userId,
        accountId: nanoid(),
        providerType: "credentials",
        password: hashedPassword,
        salt: salt,
        otpSignIn: false,
        createdAt: now,
        updatedAt: now,
      })
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error)
    process.exit(1)
  }
}

main()
