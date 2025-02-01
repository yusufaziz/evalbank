import type { Testcase } from "@prisma/client"
import type { ICheckitem } from "./checkitem"

/**
 * @brief Extended interface for a test case, including related check items.
 */
export interface ITestcase extends Testcase {
  checkitems?: ICheckitem[] // Related check items
}
