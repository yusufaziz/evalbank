import consola from "consola" // Use consola for structured logging
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../../plugins/prisma.client"

/**
 * @brief Fetches evaluation statistics for a project, grouped by judgement type.
 *
 * @param event H3 event object containing the project ID in the URL parameters.
 *
 * @returns {Promise<Array>} An array of objects representing evaluation counts by judgement type.
 *
 * @throws {Error} If the project ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<Array<any>> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Fetching evaluation statistics for project with ID: ${id}`)

    // Fetch the project evaluations
    const evaluations = await prisma.evaluation.findMany({
      where: { projectId: id },
      select: {
        judgement: true,
      },
    })

    // Calculate evaluation counts by judgement type
    const result = [
      {
        name: "OK",
        color: "green",
        judgement: EVALUATION_JUDGEMENT.OK,
        total: evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.OK).length,
      },
      {
        name: "NG",
        colour: "red",
        judgement: EVALUATION_JUDGEMENT.NG,
        total: evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NG).length,
      },
      {
        name: "Not Support",
        colour: "gray",
        judgement: EVALUATION_JUDGEMENT.NOT_SUPPORT,
        total: evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length,
      },
      {
        name: "Not Executed",
        judgement: EVALUATION_JUDGEMENT.NOT_EXECUTED,
        total: evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length,
      },
    ]

    return result
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching evaluation statistics: ${(error as Error).message}`)

    // Return an empty array in case of error
    return []
  }
})
