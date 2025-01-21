import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { projectId, testcaseId } = body

  if (!projectId || !testcaseId) {
    throw new Error("projectId and testcaseId are required")
  }

  try {
    const checkitems = await prisma.checkitem.findMany({
      where: { testcaseId },
      select: { id: true },
    })
    await prisma.evaluation.deleteMany({
      where: {
        projectId,
        checkitemId: {
          in: [...checkitems.map(c => c.id)],
        },
      },
    })

    return { message: "Unsync completed successfully" }
  }
  catch (error) {
    console.error("Failed to sync evaluations:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
