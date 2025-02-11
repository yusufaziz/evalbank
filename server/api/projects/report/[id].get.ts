import { Readable } from "node:stream"
import consola from "consola"
import { defineEventHandler } from "h3"
import puppeteer from "puppeteer"
import prisma from "~~/plugins/prisma.client"
import { reportStyle } from "~~/server/utils/reportBuilder/style"

export default defineEventHandler(async (event) => {
  try {
    // Extract the project ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to create report for project with ID: ${id}`)

    // Launch a headless browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        settings: true,
        evaluations: true,
      },
    })

    const htmlContent = `
        <html>
            <head>
            ${reportStyle}
            </head>
            <body>
            <h1>${useRuntimeConfig().public.APP_TITLE} Generated Report</h1>
            <h2>Project: ${project?.name}</h2>
            <div style="page-break-before: always;"></div>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                ${Array.from({ length: 50 }, (_, i) => `
                    <tr>
                    <td>${i + 1}</td>
                    <td>Item ${i + 1}</td>
                    <td>This is a description for item ${i + 1}.</td>
                    </tr>
                `).join("")}
                </tbody>
            </table>
            </body>
        </html>
        `

    // Set the HTML content to the page
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0", // Wait for the page to fully load
    })

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
      printBackground: true, // Ensure images and backgrounds are rendered
    })

    // Close the browser
    await browser.close()

    // Set the response headers for PDF download
    event.node.res.setHeader("Content-Type", "application/pdf")
    event.node.res.setHeader("Content-Disposition", "attachment; filename=\"generated-document.pdf\"")

    // Stream the PDF buffer to the client
    const stream = new Readable()
    stream.push(pdfBuffer)
    stream.push(null) // Signal the end of the stream
    return stream
  }
  catch (error) {
    console.error("Error generating PDF:", error)
    event.node.res.statusCode = 500
    return { error: "Error generating PDF" }
  }
})
