import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid"

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  if (params.action === "create") {
    params.args.data.id = nanoid() // Generate NanoID for new records
    params.args.data.author = "dummy-author-id" // Set the author to a dummy ID
  }
  return next(params)
})

export default prisma
