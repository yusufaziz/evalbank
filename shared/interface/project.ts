import type { Project, Setting } from "@prisma/client"

export interface IProject extends Project {
  settings?: Setting[]
}
