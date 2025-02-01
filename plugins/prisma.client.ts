import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"

const prisma = new PrismaClient()

/**
 * @brief Middleware for Prisma to automatically generate IDs and manage author/modifier fields.
 *
 * @module prismaMiddleware
 */
prisma.$use(async (params, next) => {
  try {
    if (params.action === "create") {
      params.args.data.id = nanoid() // Generate NanoID for new records
      params.args.data.author = "dummy-author-id" // Set the author to a dummy ID
    }
    else if (params.action === "createMany") {
      params.args.data.forEach((d: any) => {
        d.id = nanoid()
        d.author = "dummy-author-id" // Set the author to a dummy ID
      })
    }
    else if (params.action === "update") {
      params.args.data.modifier = "dummy-modifier-id" // Set the modifier to a dummy ID
    }
    else if (params.action === "updateMany") {
      params.args.data.forEach((d: any) => {
        d.modifier = "dummy-modifier-id" // Set the modifier to a dummy ID
      })
    }
    return next(params)
  }
  catch (error) {
    console.error(`Error in Prisma middleware: ${(error as Error).message}`)
    throw error
  }
})

export default prisma
