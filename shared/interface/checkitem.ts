import type { Checkitem, Setting } from "@prisma/client"
import type { IEvaluation } from "./evaluation"

export interface ICheckitem extends Checkitem {
  evaluations?: IEvaluation[]
  settings?: Setting[]
}
