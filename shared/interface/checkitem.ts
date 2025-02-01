import type { Checkitem, Setting } from "@prisma/client"
import type { IEvaluation } from "./evaluation"

/**
 * @brief Extended interface for a check item, including related evaluations and settings.
 */
export interface ICheckitem extends Checkitem {
  evaluations?: IEvaluation[] // Related evaluations
  settings?: Setting[] // Related settings
}
