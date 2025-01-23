import type { Setting } from "@prisma/client"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id // Get the Testcase ID from the URL
  const body = await readBody(event)

  try {
    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Destructure the payload inside the transaction
      const { checkitems: payloadCheckitems, ...testcaseData } = body

      // Update the Testcase
      const testcase = await prisma.testcase.update({
        where: { id },
        data: testcaseData,
      })

      if (payloadCheckitems && Array.isArray(payloadCheckitems)) {
        // Get the current Checkitems associated with the Testcase
        const currentCheckitems = await prisma.checkitem.findMany({
          where: { testcaseId: id },
        })

        // Extract IDs of Checkitems in the payload
        const payloadCheckitemIds = payloadCheckitems
          .filter(item => item.id !== "-")
          .map(item => item.id)

        // Delete Checkitems that are no longer in the payload
        const checkitemsToDelete = currentCheckitems.filter(
          item => !payloadCheckitemIds.includes(item.id),
        )
        for (const item of checkitemsToDelete) {
          await prisma.checkitem.delete({
            where: { id: item.id },
          })
        }

        // Update or create Checkitems
        for (const item of payloadCheckitems) {
          if (!item.id || item.id === "-") {
            // Create new Checkitem
            await prisma.checkitem.create({
              data: {
                module: item.module,
                expectedTarget: item.expectedTarget,
                testcaseId: testcase.id, // Associate with the Testcase
                settings: {
                  connect: item.settings.map((setting: Setting) => ({ id: setting.id })), // Connect the settings
                },
              },
            })
          }
          else {
            // Update existing Checkitem
            await prisma.checkitem.update({
              where: { id: item.id },
              data: {
                module: item.module,
                expectedTarget: item.expectedTarget,
                settings: {
                  set: [], // Disconnect all existing settings
                  connect: item.settings.map((setting: Setting) => ({ id: setting.id })), // Reconnect the settings
                },
              },
            })
          }
        }
      }

      // Fetch all checkitems associated with the testcase
      const dbCheckitems = await prisma.checkitem.findMany({
        where: { testcaseId: id },
        select: { id: true },
      })

      // Fetch all evaluations associated with these checkitems
      const evaluations = await prisma.evaluation.findMany({
        where: {
          checkitem: {
            id: { in: dbCheckitems.map(c => c.id) },
          },
        },
        select: { projectId: true },
      })

      // Extract unique projectIds
      const projectIds = [...new Set(evaluations.map(e => e.projectId))]

      // Regenerate evaluations for each projectId
      for (const projectId of projectIds) {
        if (projectId) {
          await regenerateEvaluations(testcase.id, projectId)
        }
      }

      return testcase
    })

    return result
  }
  catch (error) {
    console.error("Failed to update Testcase:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
