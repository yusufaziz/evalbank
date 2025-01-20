import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { projectId, testcaseId } = body

  if (!projectId || !testcaseId) {
    throw new Error("projectId and testcaseId are required")
  }

  try {
    // Fetch the project and testcase to ensure they exist
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    const testcase = await prisma.testcase.findUnique({
      where: { id: testcaseId },
    })

    if (!testcase) {
      throw new Error("Testcase not found")
    }

    // Trigger the regenerateEvaluations function
    await regenerateEvaluations(testcaseId, projectId)

    return { message: "Sync completed successfully" }
  }
  catch (error) {
    console.error("Failed to sync evaluations:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
