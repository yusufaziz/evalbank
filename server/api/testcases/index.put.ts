import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Destructure the payload
  const { checkitems, ...testcaseData } = body

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (prisma) => {
    // Create the Testcase
    const testcase = await prisma.testcase.create({
      data: testcaseData,
    })

    // Filter out Checkitems with id: "-" and create them in the database
    if (checkitems && Array.isArray(checkitems)) {
      const newCheckitems = checkitems.filter(item => item.id === "-")

      for (const item of newCheckitems) {
        await prisma.checkitem.create({
          data: {
            ...item,
            id: undefined, // Let Prisma generate the UUID
            testcaseId: testcase.id, // Associate with the newly created Testcase
          },
        })
      }
    }

    return testcase
  })

  return result
})
