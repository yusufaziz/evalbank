import prisma from "../../plugins/prisma.client"

/**
 * Helper function to compute the cartesian product of arrays.
 * This function generates all possible combinations of elements from the input arrays.
 *
 * @param arrays - An array of arrays, where each inner array represents a group of elements.
 * @returns An array of arrays, where each inner array represents a combination of elements.
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => {
      return acc.flatMap(x => array.map(y => [...x, y]))
    },
    [[]],
  )
}

/**
 * Regenerates evaluations for a given testcase and project.
 * This function processes each checkitem in the testcase, generates valid combinations of settings,
 * and creates new evaluations for each combination that doesn't already exist.
 *
 * @param testcaseId - The ID of the testcase to regenerate evaluations for.
 * @param projectId - The ID of the project associated with the testcase.
 */
export async function regenerateEvaluations(testcaseId: string, projectId: string) {
  // Increase the transaction timeout to 30 seconds (or adjust as needed)
  await prisma.$transaction(async (prisma) => {
    // Fetch the testcase and its checkitems
    const testcase = await prisma.testcase.findUnique({
      where: { id: testcaseId },
      include: {
        checkitems: {
          include: {
            settings: true, // Include settings associated with the checkitem
          },
        },
      },
    })

    if (!testcase) {
      throw new Error("Testcase not found")
    }

    // Fetch the project's connected settings
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        settings: true, // Include all settings associated with the project
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    // Fetch exclusion constraints from SettingConstraints
    const exclusionConstraints = await prisma.settingConstraints.findMany({
      where: { exclusion: true }, // Only fetch exclusion constraints
    })

    // Fetch existing evaluations for the testcase
    const existingEvaluations = await prisma.evaluation.findMany({
      where: {
        projectId,
        checkitem: {
          testcaseId, // Filter evaluations connected to the testcase through checkitem
        },
      },
      include: {
        settings: true, // Include settings to compare with valid combinations
      },
    })

    // Process each checkitem individually
    for (const checkitem of testcase.checkitems) {
      const settingsGroups: Map<string, { id: string, name: string, value: string }[]> = new Map()

      // Group settings by their name
      for (const setting of checkitem.settings) {
        if (!settingsGroups.has(setting.name)) {
          settingsGroups.set(setting.name, [])
        }
        settingsGroups.get(setting.name)?.push(setting)
      }

      // Generate all possible combinations of settings (cartesian product)
      const settingsGroupsArray = Array.from(settingsGroups.values())
      const allCombinations = cartesianProduct(settingsGroupsArray)

      // Filter combinations to exclude invalid ones based on constraints
      const validCombinations = allCombinations.filter((combination: { id: string }[]) => {
        const combinationSettingIds = combination.map((s: { id: string }) => s.id).sort().join("#")
        return !exclusionConstraints.some((constraint: { value: string }) =>
          constraint.value.split("#").sort().join("#") === combinationSettingIds,
        )
      })

      // Fetch existing evaluations for the checkitem
      const checkitemEvaluations = existingEvaluations.filter(
        (evaluation: { checkitemId: string }) => evaluation.checkitemId === checkitem.id,
      )

      // Mark evaluations that are not in valid combinations but have been modified
      for (const evaluation of checkitemEvaluations) {
        const evaluationSettingIds = evaluation.settings.map((s: { id: string }) => s.id).sort().join("#")
        const isInValidCombinations = validCombinations.some((combination: { id: string }[]) =>
          combination.map((s: { id: string }) => s.id).sort().join("#") === evaluationSettingIds,
        )

        if (!isInValidCombinations) {
          if (evaluation.createdAt.getTime() !== evaluation.updatedAt.getTime()) {
            // Evaluation has been modified, set judgement to -1
            await prisma.evaluation.update({
              where: { id: evaluation.id },
              data: {
                judgement: -1,
              },
            })
          }
          else {
            // Evaluation has not been modified, delete it
            await prisma.evaluation.delete({
              where: { id: evaluation.id },
            })
          }
        }
      }

      // Create a new evaluation for each valid combination that doesn't already exist
      const newEvaluations: {
        judgement: number
        remarks: string
        projectId: string
        checkitemId: string
        settings: { connect: { id: string }[] }
      }[] = []

      for (const combination of validCombinations) {
        const combinationSettingIds = combination.map((s: { id: string }) => s.id).sort().join("#")
        const alreadyExists = checkitemEvaluations.some((evaluation: { settings: { id: string }[] }) =>
          evaluation.settings.map((s: { id: string }) => s.id).sort().join("#") === combinationSettingIds,
        )

        if (!alreadyExists) {
          newEvaluations.push({
            judgement: 0, // Default judgement value
            remarks: "Auto-generated evaluation",
            projectId,
            checkitemId: checkitem.id,
            settings: {
              connect: combination.map((setting: { id: string }) => ({ id: setting.id })), // Connect the settings to the evaluation
            },
          })
        }
      }

      // Batch create new evaluations in smaller chunks
      const chunkSize = 100 // Adjust chunk size as needed
      for (let i = 0; i < newEvaluations.length; i += chunkSize) {
        const chunk = newEvaluations.slice(i, i + chunkSize)
        await Promise.all(
          chunk.map(evaluation =>
            prisma.evaluation.create({
              data: {
                judgement: evaluation.judgement,
                remarks: evaluation.remarks,
                project: { connect: { id: evaluation.projectId } },
                checkitem: { connect: { id: evaluation.checkitemId } },
                settings: evaluation.settings,
              },
            }),
          ),
        )
      }
    }
  }, {
    timeout: 30000, // Increase transaction timeout to 30 seconds
  })
}
