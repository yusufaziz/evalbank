import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { PrismaClient } from "@prisma/client"
import consola from "consola"

const prisma = new PrismaClient()

async function main() {
  consola.log("Starting to dump data from the database...")

  // Fetch all data from the database with relations included (only IDs)
  consola.log("Fetching projects...")
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      modelFY: true,
      modelSeries: true,
      modelName: true,
      redmineProject: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      settings: { select: { id: true } },
      evaluations: { select: { id: true } },
      attachments: { select: { id: true } },
    },
  })

  consola.log("Fetching testcases...")
  const testcases = await prisma.testcase.findMany({
    select: {
      id: true,
      name: true,
      group: true,
      procedures: true,
      redmineTitle: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      checkitems: { select: { id: true } },
      attachments: { select: { id: true } },
      evaluations: { select: { id: true } },
    },
  })

  consola.log("Fetching checkitems...")
  const checkitems = await prisma.checkitem.findMany({
    select: {
      id: true,
      module: true,
      expectedTarget: true,
      testcaseId: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      settings: { select: { id: true } },
      evaluations: { select: { id: true } },
      attachments: { select: { id: true } },
    },
  })

  consola.log("Fetching settings...")
  const settings = await prisma.setting.findMany({
    select: {
      id: true,
      name: true,
      value: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      checkitems: { select: { id: true } },
      evaluatons: { select: { id: true } },
      projects: { select: { id: true } },
      attachments: { select: { id: true } },
      requiring: { select: { id: true } },
      requiredBy: { select: { id: true } },
    },
  })

  consola.log("Fetching evaluations...")
  const evaluations = await prisma.evaluation.findMany({
    select: {
      id: true,
      judgement: true,
      redmineId: true,
      remarks: true,
      projectId: true,
      testcaseId: true,
      checkitemId: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      settings: { select: { id: true } },
      attachments: { select: { id: true } },
    },
  })

  consola.log("Fetching attachments...")
  const attachments = await prisma.attachment.findMany({
    select: {
      id: true,
      filename: true,
      author: true,
      modifier: true,
      createdAt: true,
      updatedAt: true,
      settings: { select: { id: true } },
      evaluations: { select: { id: true } },
      checkitems: { select: { id: true } },
      testcases: { select: { id: true } },
      projects: { select: { id: true } },
    },
  })

  // Prepare the seed data
  const seedData = {
    projects,
    testcases,
    checkitems,
    settings,
    evaluations,
    attachments,
  }

  // Write the seed data to a file
  const seedFilePath = path.join(".", "seed-data.json")
  fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2))
  consola.success(`Seed data has been written to ${seedFilePath}`)
}

main()
  .catch((e) => {
    consola.error("Error occurred while dumping data:", e)
    process.exit(1)
  })
