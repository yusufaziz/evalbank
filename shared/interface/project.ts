import type { Attachment, Evaluation, Project, Setting } from "@prisma/client"
import type { ITestcase } from "./testcase"

export interface IProject extends Project {
  evaluations?: Evaluation[]
  attachments?: Attachment[]
  settings?: Setting[]
}

export interface IProjectDetails extends IProject {
  testcases: ITestcase[]
}
