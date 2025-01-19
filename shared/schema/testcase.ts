import { z } from "zod"

export const zodTestcaseSchema = z.object({
  name: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  procedures: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  checkitems: z.array(
    z.object({
      module: z.string({ required_error: "Module is required" }),
      expectedTarget: z.string({ required_error: "Expected target is required" }),
      requiredSettings: z.string({ required_error: "Setting is required" }),
    }),
  ).optional(), // Optional array of checkitems
})
