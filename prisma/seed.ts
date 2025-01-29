import process from "node:process"
import consola from "consola"
import prisma from "../plugins/prisma.client"

interface PrintingOptions {
  "Paper Type": string[]
  "Paper Size": string[]
  "Printing Quality": string[]
  "SKU": string[]
  "Copy Mode": string[]
}

async function main() {
  // Create 100 Settings
  consola.info("Seeding Settings...")
  // Define the type for the object

  // Create the object with the specified keys and arrays
  const printingOptions: PrintingOptions = {
    "Paper Type": ["Plain Paper", "Plain Paper Brighter Color", "Letterhead", "Envelope", "Iron on Transfer", "Cardboard-1", "Cardboard-2", "Superfine (ESF)", "UGPP", "PGPP", "PSPP", "PLPP", "LCPP", "Double-sided business card paper (Semi glossy)", "Glossy Postcard", "Velvet Fine Art Paper", "Postcard", "Ink Jet Postcard", "Matte Paper"],
    "Paper Size": ["A3", "B-Tabloid", "B4", "Legal", "8.5\" x 13\"", "Letter", "A4", "B5", "Executive", "A5", "HalfLetter", "B6", "A6", "16K", "8K", "8x10\"", "四切", "Postcard (100x148mm)", "Round-trip Postcard", "Four-sided Postcard", "Envelope / CH3", "Envelope No.4", "Yogata No.1 / Y1", "Yogata No.3 / Y3", "Yogata No.4 / Y4", "Yogata No. 6", "Yogata No. 8", "Kakugata No. 2", "Monarch", "Envelope #10", "Envelope DL", "C4, Kakugata No. 20", "C5, Kakugata No. 6", "Envelope C6, 洋形2号", "L判, 9x13cm, 3.5x5in", "5x7", "13x18cm", "2L", "HV 16:9 Wide (102x181mm)", "4x6", "10x15cm", "KG", "Thorn (55x91mm)　", "カード (54x86mm)　", "Indian-Legal", "Mexico-Oficio", "Oficio ９", "127x127", "5x8", "13x20cm"],
    "Printing Quality": ["Draft", "Standard", "High", "Best"],
    "SKU": ["EAI", "EURO", "JPN"],
    "Copy Mode": ["1-Up", "2-Up", "4-Up", "ID Card Copy", "Book2Up"],
  }
  for (const key in printingOptions) {
    if (Object.hasOwn(printingOptions, key)) { // Use Object.hasOwn() for safer property checking
      const values = printingOptions[key as keyof PrintingOptions]
      for (let i = 0; i < values.length; i++) {
        await prisma.setting.create({
          data: {
            name: key,
            value: values[i] || "",
          },
        })
      }
    }
  }
  consola.info("Finished seeding Settings.")

  const settingIds = await prisma.setting.findMany({
    select: {
      id: true,
    },
  })
  consola.info("Creating a project...")
  await prisma.project.create({
    data: {
      name: "Alpha Evaluation",
      modelFY: 22,
      modelSeries: "Bamboo",
      modelName: "MDX",
      settings: {
        connect: settingIds.map(setting => ({ id: setting.id })),
      },
    },
  })
  consola.info("Creating a testcase...")
  const testcaseSettingIds = await prisma.setting.findMany({
    where: {
      OR: [
        { name: "Paper Type" },
        { name: "Paper Size" },
        { name: "Printing Quality" },
      ],
    },
    select: { id: true },
  })
  const testcaseSettingIds2 = await prisma.setting.findMany({
    where: {
      OR: [
        { name: "Paper Type" },
        { name: "Printing Quality" },
        { name: "SKU" },
      ],
    },
    select: { id: true },
  })
  const testcaseSettingIds3 = await prisma.setting.findMany({
    where: {
      OR: [
        { name: "Printing Quality" },
        { name: "SKU" },
        { name: "Copy Mode" },
      ],
    },
    select: { id: true },
  })
  const checkitem = await prisma.checkitem.create({
    data: {
      module: "Printer",
      expectedTarget: "Printer Check",
      settings: {
        connect: testcaseSettingIds.map(setting => ({ id: setting.id })),
      },
    },
  })
  const checkitem2 = await prisma.checkitem.create({
    data: {
      module: "Printer",
      expectedTarget: "Printer Check 2",
      settings: {
        connect: testcaseSettingIds2.map(setting => ({ id: setting.id })),
      },
    },
  })
  const checkitem3 = await prisma.checkitem.create({
    data: {
      module: "Printer",
      expectedTarget: "Printer Check 3",
      settings: {
        connect: testcaseSettingIds3.map(setting => ({ id: setting.id })),
      },
    },
  })
  await prisma.testcase.create({
    data: {
      name: "Print Test",
      procedures: "1. Turn on the printer\n2. Load the paper\n3. Print the test page",
      checkitems: {
        connect: [{ id: checkitem.id }, { id: checkitem2.id }],
      },
    },
  })
  await prisma.testcase.create({
    data: {
      name: "Print Test 2",
      procedures: "1. Turn on the printer\n2. Load the paper\n3. Print the test page",
      checkitems: {
        connect: [{ id: checkitem3.id }],
      },
    },
  })
  consola.info("Seeding completed successfully!")
}

main()
  .catch((e) => {
    consola.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
