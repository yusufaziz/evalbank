import { z } from "zod"

export const zodTestcaseSchema = z.object({
  name: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
})
