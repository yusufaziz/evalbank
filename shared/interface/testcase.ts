import type { Testcase } from "@prisma/client"
import type { ICheckitem } from "./checkitem"

export interface ITestcase extends Testcase {
  checkitems?: ICheckitem[]
}
