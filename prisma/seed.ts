import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

  // Create 100 Projects
  console.log("Seeding Projects...");
  for (let i = 0; i < 100; i++) {
    await prisma.project.create({
      data: {
        name: `Project ${i + 1}`,
        modelFY: `FY${faker.number.int({ min: 2020, max: 2023 })}`,
        modelName: `Model ${faker.string.alphanumeric(3).toUpperCase()}`,
        author: faker.person.fullName(),
      },
    });
    console.log(`Created Project ${i + 1}`);
  }
  console.log("Finished seeding Projects.");

  // Create 100 TestCases
  console.log("Seeding TestCases...");
  for (let i = 0; i < 100; i++) {
    await prisma.testCase.create({
      data: {
        name: `Test Case ${i + 1}`,
        procedures: faker.lorem.paragraph(),
      },
    });
    console.log(`Created Test Case ${i + 1}`);
  }
  console.log("Finished seeding TestCases.");

  // Create 100 Settings
  console.log("Seeding Settings...");
  for (let i = 0; i < 100; i++) {
    await prisma.setting.create({
      data: {
        name: `Setting ${i + 1}`,
        constraints: faker.lorem.sentence(),
      },
    });
    console.log(`Created Setting ${i + 1}`);
  }
  console.log("Finished seeding Settings.");

  // Create 100 CheckItems
  console.log("Seeding CheckItems...");
  const testCases = await prisma.testCase.findMany();
  const settings = await prisma.setting.findMany();

  for (let i = 0; i < 100; i++) {
    await prisma.checkItem.create({
      data: {
        expectedTarget: `Target ${i + 1}`,
        testCaseId: testCases[i % testCases.length].id, // Assign to a test case
        settings: {
          connect: [
            { id: settings[i % settings.length].id }, // Assign to a setting
            { id: settings[(i + 1) % settings.length].id }, // Assign another setting
          ],
        },
      },
    });
    console.log(`Created Check Item ${i + 1}`);
  }
  console.log("Finished seeding CheckItems.");

  // Create 100 Evaluations
  console.log("Seeding Evaluations...");
  const projects = await prisma.project.findMany();
  const checkItems = await prisma.checkItem.findMany();

  for (let i = 0; i < 100; i++) {
    await prisma.evaluation.create({
      data: {
        status: faker.helpers.arrayElement(["Pass", "Fail", "Pending"]),
        judgement: faker.helpers.arrayElement(["Approved", "Rejected", "Under Review"]),
        remarks: faker.lorem.sentence(),
        projectId: projects[i % projects.length].id, // Assign to a project
        checkItems: {
          connect: [
            { id: checkItems[i % checkItems.length].id }, // Assign to a check item
            { id: checkItems[(i + 1) % checkItems.length].id }, // Assign another check item
          ],
        },
      },
    });
    console.log(`Created Evaluation ${i + 1}`);
  }
  console.log("Finished seeding Evaluations.");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
