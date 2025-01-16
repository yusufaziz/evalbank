import process from "node:process"
import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import consola from "consola"

const prisma = new PrismaClient()

async function main() {
  consola.info("Starting seeding process...")
  consola.info("Seeding Projects...")
  for (let i = 0; i < 10; i++) {
    await prisma.project.create({
      data: {
        name: faker.lorem.sentence(),
        modelSeries: faker.food.fruit(),
        modelFY: faker.number.int({ min: 20, max: 25 }),
        modelName: `Model ${faker.string.alphanumeric(3).toUpperCase()}`,
        author: faker.person.fullName(),
      },
    })
  }
  consola.info("Finished seeding Projects.")

  // Create 100 TestCases
  consola.info("Seeding TestCases...")
  for (let i = 0; i < 100; i++) {
    await prisma.testcase.create({
      data: {
        name: `TestCase ${faker.lorem.sentence()}`,
        procedures: faker.lorem.lines(),
      },
    })
  }
  consola.info("Finished seeding TestCases.")

  // Create 100 Settings
  consola.info("Seeding Settings...")
  for (let i = 0; i < 100; i++) {
    await prisma.setting.create({
      data: {
        name: `Setting ${i + 1}`,
        value: faker.lorem.word(),
      },
    })
  }
  consola.info("Finished seeding Settings.")

  // Create 100 CheckItems
  consola.info("Seeding CheckItems...")
  const testcases = await prisma.testcase.findMany()
  const settings = await prisma.setting.findMany()
  for (let i = 0; i < 100; i++) {
    await prisma.checkitem.create({
      data: {
        expectedTarget: `Target ${i + 1}`,
        module: faker.book.publisher(),
        testCaseId: testcases[i % testcases.length].id, // Assign to a test case
        settings: {
          connect: [
            { id: settings[i % settings.length].id }, // Assign to a setting
            { id: settings[(i + 1) % settings.length].id }, // Assign another setting
          ],
        },
      },
    })
  }
  consola.info("Finished seeding CheckItems.")

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
