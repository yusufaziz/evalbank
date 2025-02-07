import type { Attachment, Evaluation, Project, Setting } from "@prisma/client"
import type { IChart } from "./chart"
import type { ISetting } from "./setting"
import type { ITestcase } from "./testcase"

/**
 * @brief Extended interface for a project, including related evaluations, attachments, and settings.
 */
export interface IProject extends Project {
  evaluations?: Evaluation[] // Related evaluations
  attachments?: Attachment[] // Related attachments
  settings?: ISetting[] // Related settings
}

/**
 * @brief Interface representing detailed project information, including test cases.
 */
export interface IProjectDetails extends IProject {
  testcases: ITestcase[] // Related test cases
}

/**
 * @brief Interface representing basic project information.
 */
export interface IProjectInfo extends IProject {}

/**
 * @brief Interface representing a check item within a test case.
 */
interface IProjectTestcaseCheckitems {
  checkitemId: string // ID of the check item
  count: number // Count of evaluations for the check item
}

/**
 * @brief Interface representing test case data within a project.
 */
export interface IProjectTestcase {
  testcases: {
    testcaseId: string // ID of the test case
    checkitems: IProjectTestcaseCheckitems[] // Related check items
  }
  totalCount?: number // Total count of evaluations
  chart: IChart // Chart data for the test case
}
