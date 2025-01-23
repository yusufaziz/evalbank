import type { Evaluation, Setting } from "@prisma/client"

export interface IEvaluation extends Evaluation {
  settings?: Setting[]
}
