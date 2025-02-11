import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { PrismaClient } from "@prisma/client"
import consola from "consola"

const prisma = new PrismaClient()

async function main() {
  consola.log("Starting to recover data from seed file...")

  const seedFilePath = path.join(".", "seed-data.json")
  const seedData = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"))

  // Phase 1: Creation - Create all records without connecting relations
  consola.log("Phase 1: Creating records...")
  await createRecords(seedData)

  // Phase 2: Update - Connect relations after all records are created
  consola.log("Phase 2: Connecting relations...")
  await connectRelations(seedData)

  consola.success("Database has been seeded successfully.")
}

async function createRecords(seedData: any) {
  consola.log("Creating settings...")
  for (const setting of seedData.settings) {
    await prisma.setting.create({
      data: {
        ...setting,
        checkitems: undefined,
        evaluatons: undefined,
        projects: undefined,
        attachments: undefined,
        requiring: undefined,
        requiredBy: undefined,
      },
    })
  }

  consola.log("Creating projects...")
  for (const project of seedData.projects) {
    await prisma.project.create({
      data: {
        ...project,
        settings: undefined,
        evaluations: undefined,
        attachments: undefined,
      },
    })
  }

  consola.log("Creating testcases...")
  for (const testcase of seedData.testcases) {
    await prisma.testcase.create({
      data: {
        ...testcase,
        checkitems: undefined,
        attachments: undefined,
        evaluations: undefined,
      },
    })
  }

  consola.log("Creating checkitems...")
  for (const checkitem of seedData.checkitems) {
    await prisma.checkitem.create({
      data: {
        ...checkitem,
        settings: undefined,
        evaluations: undefined,
        attachments: undefined,
      },
    })
  }

  consola.log("Creating evaluations...")
  for (const evaluation of seedData.evaluations) {
    await prisma.evaluation.create({
      data: {
        ...evaluation,
        settings: undefined,
        attachments: undefined,
      },
    })
  }

  consola.log("Creating attachments...")
  for (const attachment of seedData.attachments) {
    await prisma.attachment.create({
      data: {
        ...attachment,
        settings: undefined,
        evaluations: undefined,
        checkitems: undefined,
        testcases: undefined,
        projects: undefined,
      },
    })
  }
}

async function connectRelations(seedData: any) {
  consola.log("Connecting relations for settings...")
  for (const setting of seedData.settings) {
    await prisma.setting.update({
      where: { id: setting.id },
      data: {
        checkitems: {
          connect: setting.checkitems.map((checkitem: { id: string }) => ({ id: checkitem.id })),
        },
        evaluatons: {
          connect: setting.evaluatons.map((evaluation: { id: string }) => ({ id: evaluation.id })),
        },
        projects: {
          connect: setting.projects.map((project: { id: string }) => ({ id: project.id })),
        },
        attachments: {
          connect: setting.attachments.map((attachment: { id: string }) => ({ id: attachment.id })),
        },
        requiring: {
          connect: setting.requiring.map((reqSetting: { id: string }) => ({ id: reqSetting.id })),
        },
        requiredBy: {
          connect: setting.requiredBy.map((reqSetting: { id: string }) => ({ id: reqSetting.id })),
        },
      },
    })
  }

  consola.log("Connecting relations for projects...")
  for (const project of seedData.projects) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        settings: {
          connect: project.settings.map((setting: { id: string }) => ({ id: setting.id })),
        },
        evaluations: {
          connect: project.evaluations.map((evaluation: { id: string }) => ({ id: evaluation.id })),
        },
        attachments: {
          connect: project.attachments.map((attachment: { id: string }) => ({ id: attachment.id })),
        },
      },
    })
  }

  consola.log("Connecting relations for testcases...")
  for (const testcase of seedData.testcases) {
    await prisma.testcase.update({
      where: { id: testcase.id },
      data: {
        checkitems: {
          connect: testcase.checkitems.map((checkitem: { id: string }) => ({ id: checkitem.id })),
        },
        attachments: {
          connect: testcase.attachments.map((attachment: { id: string }) => ({ id: attachment.id })),
        },
        evaluations: {
          connect: testcase.evaluations.map((evaluation: { id: string }) => ({ id: evaluation.id })),
        },
      },
    })
  }

  consola.log("Connecting relations for checkitems...")
  for (const checkitem of seedData.checkitems) {
    await prisma.checkitem.update({
      where: { id: checkitem.id },
      data: {
        settings: {
          connect: checkitem.settings.map((setting: { id: string }) => ({ id: setting.id })),
        },
        evaluations: {
          connect: checkitem.evaluations.map((evaluation: { id: string }) => ({ id: evaluation.id })),
        },
        attachments: {
          connect: checkitem.attachments.map((attachment: { id: string }) => ({ id: attachment.id })),
        },
      },
    })
  }

  consola.log("Connecting relations for evaluations...")
  for (const evaluation of seedData.evaluations) {
    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: {
        settings: {
          connect: evaluation.settings.map((setting: { id: string }) => ({ id: setting.id })),
        },
        attachments: {
          connect: evaluation.attachments.map((attachment: { id: string }) => ({ id: attachment.id })),
        },
      },
    })
  }

  consola.log("Connecting relations for attachments...")
  for (const attachment of seedData.attachments) {
    await prisma.attachment.update({
      where: { id: attachment.id },
      data: {
        settings: {
          connect: attachment.settings.map((setting: { id: string }) => ({ id: setting.id })),
        },
        evaluations: {
          connect: attachment.evaluations.map((evaluation: { id: string }) => ({ id: evaluation.id })),
        },
        checkitems: {
          connect: attachment.checkitems.map((checkitem: { id: string }) => ({ id: checkitem.id })),
        },
        testcases: {
          connect: attachment.testcases.map((testcase: { id: string }) => ({ id: testcase.id })),
        },
        projects: {
          connect: attachment.projects.map((project: { id: string }) => ({ id: project.id })),
        },
      },
    })
  }
}

main()
  .catch((e) => {
    consola.error("Error occurred while recovering data:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    consola.log("Database connection closed.")
  })
