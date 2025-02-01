import { z } from "zod"

/**
 * @brief Schema for validating setting data.
 */
export const zodSettingSchema = z.object({
  name: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  value: z.string({ required_error: "Required" }),
})
