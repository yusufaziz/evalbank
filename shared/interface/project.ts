import type { Project } from "@prisma/client"

export interface IGroupedSubProjects {
  title: string
  item: Project[]
}
export interface IGroupedProjects {
  title: string
  item: IGroupedSubProjects
}
