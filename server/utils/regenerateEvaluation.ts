import type { Setting } from "@prisma/client"
import type { IEvaluationItems } from "~~/shared/interface/evaluation"
import consola from "consola"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
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
 * Regenerates evaluations for a given testcase and project.
 * This function processes each checkitem in the testcase, generates valid combinations of settings,
 * and creates new evaluations for each combination that doesn't already exist.
 *
 * @param testcaseId - The ID of the testcase to regenerate evaluations for.
 * @param projectId - The ID of the project associated with the testcase.
 */
export async function regenerateEvaluations(testcaseId: string, projectId: string) {
  // Fetch all required data in parallel
  const [testcase, project, exclusionConstraints, existingEvaluations] = await Promise.all([
    prisma.testcase.findUnique({
      where: { id: testcaseId },
      include: { checkitems: { include: { settings: true } } },
    }),
    prisma.project.findUnique({
      where: { id: projectId },
      include: { settings: true },
    }),
    prisma.settingConstraints.findMany({ where: { exclusion: true } }),
    prisma.evaluation.findMany({
      where: { projectId, checkitem: { testcaseId }, judgement: EVALUATION_JUDGEMENT.NOT_EXECUTED },
      include: { settings: true },
    }),
  ])

  if (!testcase || !project) {
    throw new Error("Testcase or Project not found")
  }

  // Create a Set of exclusion constraints for fast lookup
  const exclusionSet = new Set(
    exclusionConstraints.map(constraint => constraint.value.split("#").sort().join("#")),
  )

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
      const combinationSettingIds = combination.sort().join("#")
      return !exclusionSet.has(combinationSettingIds)
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
        if (evaluation.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED) {
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

  runTask("evaluation:sync", { payload: evaluationItems })
}
