import type { Evaluation, Setting } from "@prisma/client"
import type { TaskPayload } from "nitropack/types"
import type { EVALUATION_JUDGEMENT } from "../enum"
import type { ICheckitem } from "./checkitem"
import type { ITestcase } from "./testcase"

/**
 * @brief Extended interface for an evaluation, including related settings.
 */
export interface IEvaluation extends Evaluation {
  checkitem?: ICheckitem
  testcase?: ITestcase
  settings?: Setting[] // Related settings
}

/**
 * @brief Interface representing evaluation count information.
 */
export interface IEvaluationCount {
  OK?: number // Count of evaluations with "OK" judgement
  NG?: number // Count of evaluations with "NG" judgement
  NOT_EXECUTED?: number // Count of evaluations with "NOT_EXECUTED" judgement
  NOT_SUPPORT?: number // Count of evaluations with "NOT_SUPPORT" judgement
}

/**
 * @brief Interface representing paginated evaluation data.
 */
export interface IEvaluationPagination {
  evaluations: IEvaluation[] // Array of evaluations
  evaluationCount?: IEvaluationCount // Count of evaluations by judgement
  totalEvaluations?: number // Total number of evaluations
}

/**
 * @brief Interface representing a single evaluation item.
 */
export interface IEvaluationItem {
  judgement: typeof EVALUATION_JUDGEMENT.NOT_EXECUTED // Judgement status
  testcaseId: string // ID of the associated test case
  projectId: string // ID of the associated project
  checkitemId: string // ID of the associated check item
  settings: string[] // IDs of related settings
}

/**
 * @brief Interface representing a payload for synchronization tasks.
 */
export interface IEvaluationItems extends TaskPayload {
  new: IEvaluationItem[] // New evaluations to create
  not_supportIds: string[] // IDs of evaluations to mark as "NOT_SUPPORT"
  deleteIds: string[] // IDs of evaluations to delete
}
