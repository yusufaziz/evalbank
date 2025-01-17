import { z } from "zod"

export const zodCheckitemSchema = z.object({
  module: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  expectedTarget: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  settingsNames: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
})
