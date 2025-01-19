import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id // Get the Testcase ID from the URL
  const body = await readBody(event)

  try {
    // Destructure the payload
    const { checkitems, ...testcaseData } = body

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Update the Testcase
      const testcase = await prisma.testcase.update({
        where: { id },
        data: testcaseData,
      })

      if (checkitems && Array.isArray(checkitems)) {
        // Get the current Checkitems associated with the Testcase
        const currentCheckitems = await prisma.checkitem.findMany({
          where: { testcaseId: id },
        })

        // Extract IDs of Checkitems in the payload
        const payloadCheckitemIds = checkitems
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
        for (const item of checkitems) {
          if (item.id === "-") {
            // Create new Checkitem
            await prisma.checkitem.create({
              data: {
                ...item,
                id: undefined, // Let Prisma generate the UUID
                testcaseId: testcase.id, // Associate with the Testcase
              },
            })
          }
          else {
            // Update existing Checkitem
            await prisma.checkitem.update({
              where: { id: item.id },
              data: item,
            })
          }
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
