import { z } from "zod";

export const zodProjectSchema = z.object({
  name: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  modelSeries: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  modelName: z.string({ required_error: "Required" }).min(3, { message: "Min 3 characters" }),
  author: z.string(),
  modelFY: z
    .number({
      coerce: true,
      required_error: "Required",
      invalid_type_error: "Please enter a number",
    })
    .int("Only numbers are allowed")
    .min(20, "It should be register above FY20")
    .max(50, "Model FY must be under FY50"),
});
