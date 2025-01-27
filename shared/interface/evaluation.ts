import type { Evaluation, Setting } from "@prisma/client"
import type { TaskPayload } from "nitropack/types"
import type { EVALUATION_JUDGEMENT } from "../enum"

export interface IEvaluation extends Evaluation {
  settings?: Setting[]
}

export interface IEvaluationItem {
  judgement: typeof EVALUATION_JUDGEMENT.NOT_EXECUTED
  testcaseId: string
  projectId: string
  checkitemId: string
  settings: string[]
}

export interface IEvaluationItems extends TaskPayload {
  new: IEvaluationItem[]
  not_supportIds: string[]
  deleteIds: string[]
}
