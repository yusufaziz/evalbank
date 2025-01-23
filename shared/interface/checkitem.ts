import type { Checkitem, Evaluation, Setting } from "@prisma/client"

export interface ICheckitem extends Checkitem {
  evaluations?: Evaluation[]
  settings?: Setting[]
}
