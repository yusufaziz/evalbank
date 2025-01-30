import type { Attachment, Evaluation, Project, Setting } from "@prisma/client"
import type { IChart } from "./chart"
import type { ITestcase } from "./testcase"

export interface IProject extends Project {
  evaluations?: Evaluation[]
  attachments?: Attachment[]
  settings?: Setting[]
}

export interface IProjectDetails extends IProject {
  testcases: ITestcase[]
}

export interface IProjectInfo extends IProject {

}

interface IProjectTestcaseCheckitems {
  checkitemId: string
  count: number
}
export interface IProjectTestcase {
  testcases: {
    testcaseId: string
    checkitems: IProjectTestcaseCheckitems[]
  }
  totalCount?: number
  chart: IChart
}
