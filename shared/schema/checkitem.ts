import { z } from "zod"

/**
 * @brief Schema for validating check item data.
 */
export const zodCheckitemSchema = z.object({
  module: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  expectedTarget: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  settingsNames: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
})
