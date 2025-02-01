import type { TaskEvent } from "nitropack/types"
import type { IEvaluationItems } from "~~/shared/interface/evaluation"
import consola from "consola" // Use consola for structured logging
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Synchronizes evaluation settings by performing delete, update, and create operations.
 *
 * @param event TaskEvent object containing the payload for synchronization.
 *
 * @returns {Promise<{ result: string }>} A success message indicating the synchronization was completed.
 *
 * @throws {Error} If the payload is invalid or if there is a database error.
 */
export default defineTask({
  meta: {
    name: "evaluation:sync",
    description: "Synchronize evaluation settings",
  },
  async run(event: TaskEvent): Promise<{ result: string }> {
    try {
      const payload = event.payload as IEvaluationItems // Cast the payload to IEvaluationItems

      // Validate the payload
      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid payload: Payload must be a non-empty object.")
      }

      consola.info("Synchronizing evaluation settings")
      consola.debug("Payload:", payload)

      // Step 1: Delete evaluations
      if (payload.deleteIds && Array.isArray(payload.deleteIds) && payload.deleteIds.length > 0) {
        consola.info(`Deleting evaluations with IDs: ${payload.deleteIds.join(", ")}`)
        await prisma.evaluation.deleteMany({
          where: {
            id: {
              in: payload.deleteIds,
            },
          },
        })
      }

      // Step 2: Update evaluations to NOT_SUPPORT
      if (
        payload.not_supportIds
        && Array.isArray(payload.not_supportIds)
        && payload.not_supportIds.length > 0
      ) {
        consola.info(`Updating evaluations to NOT_SUPPORT with IDs: ${payload.not_supportIds.join(", ")}`)
        await prisma.evaluation.updateMany({
          where: {
            id: {
              in: payload.not_supportIds,
            },
          },
          data: {
            judgement: EVALUATION_JUDGEMENT.NOT_SUPPORT,
          },
        })
      }

      // Step 3: Create new evaluations
      if (payload.new && Array.isArray(payload.new) && payload.new.length > 0) {
        consola.info(`Creating ${payload.new.length} new evaluations`)
        await prisma.$transaction(
          payload.new.map((evaluation) => {
            return prisma.evaluation.create({
              data: {
                judgement: evaluation.judgement,
                projectId: evaluation.projectId,
                checkitemId: evaluation.checkitemId,
                testcaseId: evaluation.testcaseId,
                settings: {
                  connect: evaluation.settings.map(id => ({ id })),
                },
              },
            })
          }),
        )
      }

      consola.success("Successfully synchronized evaluation settings")
      return { result: "Success" }
    }
    catch (error) {
      // Log the error using consola
      consola.error(`Error synchronizing evaluation settings: ${(error as Error).message}`)

      // Handle specific Prisma errors (optional)
      if ((error as any).code === "P2025") {
        throw new Error("One or more evaluations not found during synchronization.")
      }

      // Return a generic error response
      throw new Error("An error occurred while synchronizing evaluation settings")
    }
  },
})
