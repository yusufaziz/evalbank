import { z } from "zod"

export const zodSettingSchema = z.object({
  name: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  value: z.string({ required_error: "Required" }),
})
