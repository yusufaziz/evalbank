import type { Checkitem, Setting } from "@prisma/client"

export interface ICheckitem extends Checkitem {
  settings?: Setting[]
}
