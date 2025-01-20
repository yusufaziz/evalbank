import prisma from "../../plugins/prisma.client"

export async function regenerateEvaluations(testcaseId: string, projectId: string) {
  // Fetch the testcase and its checkitems
  const testcase = await prisma.testcase.findUnique({
    where: { id: testcaseId },
    include: {
      checkitems: true, // Include all checkitems
    },
  })

  if (!testcase) {
    throw new Error("Testcase not found")
  }

  // Fetch the project's connected settings
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      settings: true, // Include the project's connected settings
    },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  const projectSettings = project.settings

  // Parse requiredSettings and fetch matching settings for all checkitems
  const settingsGroups: Map<string, { id: string, name: string, value: string }[]> = new Map()

  for (const checkitem of testcase.checkitems) {
    if (!checkitem.requiredSettings)
      continue

    const patterns = checkitem.requiredSettings.split("|")
    for (const pattern of patterns) {
      const [name, valuesStr] = pattern.split("(")
      const values = valuesStr.replace(")", "").split(",")

      // Fetch settings based on the pattern
      const settings = await prisma.setting.findMany({
        where: {
          name,
          value: values.includes("*") ? undefined : { in: values },
        },
      })

      // Add settings to the groups map
      if (!settingsGroups.has(name)) {
        settingsGroups.set(name, [])
      }
      settingsGroups.get(name)?.push(...settings)
    }
  }

  // Generate all possible combinations of settings (cartesian product)
  const settingsGroupsArray = Array.from(settingsGroups.values())
  const allCombinations = cartesianProduct(settingsGroupsArray)

  // Filter combinations to include only those where all settings exist in the project's settings
  const validCombinations = allCombinations.filter(combination =>
    combination.every(setting =>
      projectSettings.some(projectSetting => projectSetting.id === setting.id),
    ),
  )

  // Delete existing evaluations for the testcase
  await prisma.evaluation.deleteMany({
    where: {
      projectId,
      settings: {
        every: {
          testcases: {
            some: { id: testcaseId },
          },
        },
      },
    },
  })

  // Create a new evaluation for each valid combination
  const evaluations = []
  for (const combination of validCombinations) {
    const evaluation = await prisma.evaluation.create({
      data: {
        judgement: 0, // Default judgement value
        remarks: "Auto-generated evaluation",
        project: { connect: { id: projectId } },
        settings: {
          connect: combination.map(setting => ({ id: setting.id })),
        },
      },
      include: {
        settings: true, // Include settings in the response
      },
    })
    evaluations.push(evaluation)
  }

  return evaluations
}
