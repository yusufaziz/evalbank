import consola from "consola"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Log the incoming payload for debugging
  consola.log("Incoming Payload:", JSON.stringify(body, null, 2))

  // Destructure the payload
  const { checkitems, ...testcaseData } = body

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (prisma) => {
    // Create the Testcase
    const testcase = await prisma.testcase.create({
      data: testcaseData,
    })

    // Log the created Testcase for debugging
    consola.log("Created Testcase:", testcase)

    // Filter out Checkitems with id: "-" and create them in the database
    if (checkitems && Array.isArray(checkitems)) {
      const newCheckitems = checkitems.filter(item => item.id === "-" || !item.id)

      // Log the new Checkitems for debugging
      consola.log("New Checkitems to Create:", newCheckitems)

      for (const item of newCheckitems) {
        try {
          // Create the Checkitem and connect the settings
          const createdCheckitem = await prisma.checkitem.create({
            data: {
              module: item.module,
              expectedTarget: item.expectedTarget,
              testcaseId: testcase.id, // Associate with the newly created Testcase
              settings: {
                connect: item.settings.map(setting => ({ id: setting.id })), // Connect the settings
              },
            },
          })

          // Log the created Checkitem for debugging
          consola.log("Created Checkitem:", createdCheckitem)
        }
        catch (error) {
          consola.error("Failed to create Checkitem:", error)
          throw error
        }
      }
    }

    return testcase
  })

  return result
})
