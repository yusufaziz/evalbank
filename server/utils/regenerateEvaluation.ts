import type { Setting } from "@prisma/client"
import type { IEvaluationItems } from "~~/shared/interface/evaluation"
import consola from "consola" // Use consola for structured logging
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../plugins/prisma.client"

/**
 * @brief Helper function to compute the cartesian product of arrays.
 * @details This function generates all possible combinations of elements from the input arrays.
 * @tparam T - The type of elements in the arrays.
 * @param arrays - An array of arrays, where each inner array represents a group of elements.
 * @returns An array of arrays, where each inner array represents a combination of elements.
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, array) => acc.flatMap(x => array.map(y => [...x, y])),
    [[]],
  )
}

/**
 * @brief Filters the checkitem.settings array to only include settings that exist in project.settings.
 * @param checkitemSettings - The settings array from the checkitem.
 * @param projectSettings - The settings array from the project.
 * @returns A filtered array of settings that exist in both checkitem.settings and project.settings.
 */
function filterSettings(checkitemSettings: Setting[], projectSettings: Setting[]): Setting[] {
  const projectSettingIds = new Set(projectSettings.map(setting => setting.id))
  return checkitemSettings.filter(setting => projectSettingIds.has(setting.id))
}

/**
 * @brief Regenerates evaluations for a given testcase and project.
 * @details This function processes each checkitem in the testcase, generates valid combinations of settings,
 * and creates new evaluations for each combination that doesn't already exist.
 * @param testcaseId - The ID of the testcase to regenerate evaluations for.
 * @param projectId - The ID of the project associated with the testcase.
 * @throws Error if the testcase or project is not found.
 */
export async function regenerateEvaluations(testcaseId: string, projectId: string): Promise<void> {
  try {
    consola.info(`Regenerating evaluations for testcaseId: ${testcaseId}, projectId: ${projectId}`)

    // Validate inputs
    if (!testcaseId || typeof testcaseId !== "string") {
      throw new Error("Invalid testcaseId: Must be a non-empty string.")
    }
    if (!projectId || typeof projectId !== "string") {
      throw new Error("Invalid projectId: Must be a non-empty string.")
    }

    // Fetch all required data in parallel
    const [testcase, project, existingEvaluations, settings] = await Promise.all([
      prisma.testcase.findUnique({
        where: { id: testcaseId },
        include: { checkitems: { include: { settings: true } } },
      }),
      prisma.project.findUnique({
        where: { id: projectId },
        include: { settings: true },
      }),
      prisma.evaluation.findMany({
        where: { projectId, checkitem: { testcaseId }, judgement: EVALUATION_JUDGEMENT.NOT_EXECUTED },
        include: { settings: true },
      }),
      prisma.setting.findMany({
        include: { requiring: true },
      }),
    ])

    if (!testcase || !project) {
      throw new Error("Testcase or Project not found")
    }

    const evaluationItems: IEvaluationItems = {
      new: [],
      not_supportIds: [],
      deleteIds: [],
    }

    // Process each checkitem individually
    for (const checkitem of testcase.checkitems) {
      const settingsGroups: Map<string, string[]> = new Map()

      // Group settings by their name using filtered settings that are available in project.settings
      for (const setting of filterSettings(checkitem.settings, project.settings)) {
        if (!settingsGroups.has(setting.name)) {
          settingsGroups.set(setting.name, [])
        }
        settingsGroups.get(setting.name)?.push(setting.id)
      }

      // Generate all possible combinations of settings (cartesian product)
      const settingsGroupsArray = Array.from(settingsGroups.values())
      const allCombinations = cartesianProduct(settingsGroupsArray)

      // Filter combinations to exclude invalid ones based on constraints
      const validCombinations = allCombinations.filter((combination) => {
        let isValid = true
        combination.forEach((id) => {
          const settingItem = settings.find(setting => setting.id === id)
          if (settingItem && settingItem.requiring.length > 0) {
            // Check if any of the requiring settings are in the combination
            const hasRequiredSetting = settingItem.requiring.some(requiredSetting =>
              combination.includes(requiredSetting.id),
            )
            if (!hasRequiredSetting) {
              isValid = false
            }
          }
        })
        return isValid
      })

      // Fetch existing evaluations for the checkitem
      const checkitemEvaluations = existingEvaluations.filter(
        evaluation => evaluation.checkitemId === checkitem.id,
      )

      // Mark evaluations that are not in valid combinations but have been modified
      checkitemEvaluations
        .filter((evaluation) => {
          const evaluationSettingIds = evaluation.settings.map(s => s.id).sort().join("#")
          return !validCombinations.some(
            combination => combination.sort().join("#") === evaluationSettingIds,
          )
        })
        .forEach((evaluation) => {
          if (evaluation.judgement !== EVALUATION_JUDGEMENT.NOT_EXECUTED) {
            evaluationItems.not_supportIds.push(evaluation.id)
          }
          else {
            evaluationItems.deleteIds.push(evaluation.id)
          }
        })

      // Create new evaluations for valid combinations that don't already exist
      validCombinations
        .filter((combination) => {
          const combinationSettingIds = combination.sort().join("#")
          return !checkitemEvaluations.some(
            evaluation =>
              evaluation.settings.map(s => s.id).sort().join("#") === combinationSettingIds,
          )
        })
        .forEach((combination) => {
          evaluationItems.new.push({
            judgement: EVALUATION_JUDGEMENT.NOT_EXECUTED,
            testcaseId,
            projectId,
            checkitemId: checkitem.id,
            settings: combination,
          })
        })
    }

    // Run the synchronization task
    consola.info("Running evaluation sync task with payload:", evaluationItems)
    runTask("evaluation:sync", { payload: evaluationItems })

    consola.success("Successfully regenerated evaluations")
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error regenerating evaluations: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      throw new Error("Testcase or Project not found during regeneration.")
    }

    // Return a generic error response
    throw new Error("An error occurred while regenerating evaluations")
  }
}
