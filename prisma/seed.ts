import process from "node:process"
import { PrismaClient } from "@prisma/client"
import consola from "consola"

const prisma = new PrismaClient()

interface PrintingOptions {
  "Paper Type": string[]
  "Paper Size": string[]
  "Printing Quality": string[]
  "Region": string[]
  "Printing Resolution": string[]
  "Scanning Resolution": string[]
  "Paper Input Source": string[]
  "Printing Mode": string[]
}

async function main() {
  // Create 100 Settings
  consola.info("Seeding Settings...")
  // Define the type for the object

  // Create the object with the specified keys and arrays
  const printingOptions: PrintingOptions = {
    "Paper Type": ["Glossy", "Matte", "Satin", "Canvas", "Recycled", "Photo Paper", "Transparency"],
    "Paper Size": ["A4", "A5", "Letter", "Legal", "A3", "A6", "Tabloid", "Envelope"],
    "Printing Quality": ["High", "Medium", "Low", "Draft", "Best"],
    "Region": ["North America", "Europe", "Asia", "Australia", "South America", "Africa", "Antarctica"],
    "Printing Resolution": ["300 dpi", "600 dpi", "1200 dpi", "2400 dpi", "4800 dpi"],
    "Scanning Resolution": ["150 dpi", "300 dpi", "600 dpi", "1200 dpi", "2400 dpi"],
    "Paper Input Source": ["Auto Sheet Feeder", "Manual Feed", "Tray 1", "Tray 2", "Tray 3", "Bypass Tray"],
    "Printing Mode": ["Duplex", "Simplex", "Auto Duplex", "Manual Duplex"],
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
