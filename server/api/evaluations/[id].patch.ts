import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Updates an evaluation by its unique identifier.
 *
 * @param event H3 event object containing the evaluation ID in the URL parameters and update data in the request body.
 *
 * @returns {Promise<object | { message: string }>} The updated evaluation object if successful, or a message indicating failure.
 *
 * @throws {Error} If the evaluation ID is invalid, the request body is malformed, or there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    // Extract the evaluation ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid evaluation ID: ID must be provided as a string.")
    }

    // Read and validate the request body
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw new Error("Invalid request body: Body must be a non-empty object.")
    }

    consola.info(`Attempting to update evaluation with ID: ${id}`)

    const files = formData.filter(item => item.name?.includes("files"))
    const updateDataRaw = formData.filter(item => item.name === "data")
    let updateData = {}
    if (updateDataRaw.length > 0) {
      const stringData = updateDataRaw[0].data.toString()
      consola.log(stringData)
      consola.log(JSON.parse(stringData))
      updateData = JSON.parse(stringData)
    }

    // Process the files and save them to prisma.attachment
    const attachments = await Promise.all(
      files.map(async (file) => {
        const { filename, data } = file
        if (!filename) {
          throw new Error("File must have a filename.")
        }
        const attachment = await prisma.attachment.create({
          data: {
            filename,
            evaluations: { connect: { id } },
          },
        })
        // Save the file to the public/attachment folder with the attachment ID as the filename
        const attachmentPath = path.join(process.cwd(), "public", "attachments", attachment.id)
        consola.log(`Saving attachment to: ${attachmentPath}`)
        await fs.writeFile(attachmentPath, data)
        return attachment
      }),
    )

    consola.log(`Updating evaluation with data: ${JSON.parse(updateData.toString())}`)
    consola.log(`Attachment: ${JSON.stringify(attachments)}`)

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id },
      data: {
        ...JSON.parse(updateData.toString()),
        attachments: {
          connect: attachments.map(attachment => ({ id: attachment.id })),
        },
      },
    })

    consola.success(`Successfully updated evaluation with ID: ${id}`)
    return updatedEvaluation
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error updating evaluation: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      // Prisma error code for "Record not found"
      return { message: "Evaluation not found" }
    }

    // Return a generic error response
    return { message: "An error occurred while updating the evaluation" }
  }
})
