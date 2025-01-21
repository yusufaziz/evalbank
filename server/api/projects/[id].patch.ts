import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw new Error("ID is required")
  }

  const { settingIds, ...rest } = body

  // Fetch the current project settings
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      settings: true,
    },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  // Check if settingIds is provided and different from existing settings
  if (settingIds) {
    const currentSettingIds = project.settings.map(s => s.id).sort().join(",")
    const newSettingIds = settingIds.sort().join(",")

    if (currentSettingIds !== newSettingIds) {
      // Update project settings
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...rest,
          settings: {
            set: [], // Disconnect all existing settings
            connect: settingIds.map((settingId: string) => ({ id: settingId })), // Connect new settings
          },
        },
        include: {
          settings: true, // Include the updated settings in the response
        },
      })

      // Fetch all evaluations associated with the project
      const evaluations = await prisma.evaluation.findMany({
        where: { projectId: id },
        include: {
          checkitem: {
            select: {
              testcaseId: true, // Include testcaseId from checkitems
            },
          },
        },
      })

      // Extract unique testcaseIds from checkitems
      const testcaseIds = [
        ...new Set(evaluations.flatMap(e => e.checkitem.map(c => c.testcaseId))),
      ]

      // Regenerate evaluations for each testcaseId
      for (const testcaseId of testcaseIds) {
        await regenerateEvaluations(testcaseId, id)
      }

      return updatedProject
    }
  }

  // Update other project information if provided
  const updatedProject = await prisma.project.update({
    where: { id },
    data: rest,
  })

  return updatedProject
})
