import prisma from "../../plugins/prisma.client"

// Helper function to compute the cartesian product of arrays
function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => {
      return acc.flatMap(x => array.map(y => [...x, y]))
    },
    [[]],
  )
}

export async function regenerateEvaluations(testcaseId: string, projectId: string) {
  await prisma.$transaction(async (prisma) => {
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
        const patternTrimmed = pattern.trim()
        if (!patternTrimmed)
          continue

        // Check if the pattern includes values (e.g., "Printing Resolution(300 dpi,1200 dpi)")
        if (patternTrimmed.includes("(")) {
          const [name, valuesStr] = patternTrimmed.split("(")

          // Validate that valuesStr is defined and contains a closing parenthesis
          if (!valuesStr || !valuesStr.includes(")")) {
            console.error(`Invalid requiredSettings format: ${patternTrimmed}`)
            continue
          }

          const values = valuesStr
            .replace(")", "") // Remove the closing parenthesis
            .split(",") // Split into individual values
            .map(v => v.trim()) // Trim whitespace

          // Fetch settings with the matching name and values
          const settings = await prisma.setting.findMany({
            where: {
              name: name.trim(),
              value: { in: values },
            },
          })

          // Add settings to the groups map
          if (!settingsGroups.has(name.trim())) {
            settingsGroups.set(name.trim(), [])
          }
          settingsGroups.get(name.trim())?.push(...settings)
        }
        else {
          // Fetch all settings with the matching name (no values specified)
          const settings = await prisma.setting.findMany({
            where: {
              name: patternTrimmed,
            },
          })

          // Add settings to the groups map
          if (!settingsGroups.has(patternTrimmed)) {
            settingsGroups.set(patternTrimmed, [])
          }
          settingsGroups.get(patternTrimmed)?.push(...settings)
        }
      }
    }

    // Generate all possible combinations of settings (cartesian product)
    const settingsGroupsArray = Array.from(settingsGroups.values())
    const allCombinations = cartesianProduct(settingsGroupsArray)

    // Fetch exclusion constraints from SettingConstraints
    const exclusionConstraints = await prisma.settingConstraints.findMany({
      where: { exclusion: true }, // Only exclusion constraints
    })

    // Filter combinations to exclude invalid ones based on constraints
    const validCombinations = allCombinations.filter((combination) => {
      const combinationSettingIds = combination.map(s => s.id).sort().join("#")
      return !exclusionConstraints.some(constraint =>
        constraint.value.split("#").sort().join("#") === combinationSettingIds,
      )
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

    // Mark evaluations that are not in valid combinations but have been modified
    for (const evaluation of existingEvaluations) {
      const evaluationSettingIds = evaluation.settings.map(s => s.id).sort().join("#")
      const isInValidCombinations = validCombinations.some(combination =>
        combination.map(s => s.id).sort().join("#") === evaluationSettingIds,
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
    for (const combination of validCombinations) {
      const combinationSettingIds = combination.map(s => s.id).sort().join("#")
      const alreadyExists = existingEvaluations.some(evaluation =>
        evaluation.settings.map(s => s.id).sort().join("#") === combinationSettingIds,
      )

      if (!alreadyExists) {
        // Create a new evaluation for each checkitem
        for (const checkitem of testcase.checkitems) {
          await prisma.evaluation.create({
            data: {
              judgement: 0, // Default judgement value
              remarks: "Auto-generated evaluation",
              project: { connect: { id: projectId } },
              checkitem: { connect: { id: checkitem.id } }, // Connect to the checkitem
              settings: {
                connect: combination.map(setting => ({ id: setting.id })),
              },
            },
          })
        }
      }
    }
  })
}
