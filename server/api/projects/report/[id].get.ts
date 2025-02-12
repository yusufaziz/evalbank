import type { Evaluation, Testcase } from "@prisma/client"
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { ITestcase } from "~~/shared/interface/testcase"
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

    const query = getQuery(event)

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to create report for project with ID: ${id}`)

    const testcases = await prisma.testcase.findMany({
      where: {
        evaluations: {
          some: {
            projectId: id,
          },
        },
      },
      include: {
        checkitems: {
          include: {
            evaluations: {
              include: { settings: true },
            },
          },
        },
      },
    })
    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        settings: true,
      },
    })
    const htmlContent = `
        <html>
            <head>
            ${reportStyle}
            </head>
            <body>
            <h1>${useRuntimeConfig().public.APP_TITLE} Generated Report</h1>
            <div>
            <h3>Project: ${project?.name}</h3>
            <h3>Model: FY${project?.modelFY} ${project?.modelSeries}-${project?.modelName}</h3>
            <h3>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</h3>
            </div>
            <div style="page-break-before: always;"></div>
            ${
              testcases.map((testcase, _i) => {
                return `<h4>Testcase: ${testcase?.name}</h4>
                <h4>Procedures:</h4>
                <p>${testcase?.procedures.split("\n").join("<br/>")}</p>
                <h4>Evaluation Result:</h4>
                ${
                  testcase.checkitems.map((checkitem, _ic) => {
                    return `
                        <h5>
                        Checkitem Expected Target: ${checkitem.expectedTarget}<br/>
                        Module : ${checkitem.module}
                        </h5>
                <table>
                    <thead>
                    <tr>
                        <th>Settings</th>
                        <th>Judgement</th>
                        <th>Remarks</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${
                      checkitem.evaluations.map((evaluation, _ie) => {
                        return `
                        <tr>
                        <td>${evaluation.settings.map(s => `${s.name}: ${s.value}<br/>`).join("")}</td>
                        <td>${evaluation.judgement}</td>
                        <td>${evaluation.remarks}</td>
                        </tr>
                        `
                      }).join("")
                    }
                    </tbody>
                </table>
                    `
                  })
                }
                
                <div style="page-break-before: always;"></div>
                `
              }).join("")
            }
            </body>
        </html>
        `
    if (query.skipdownload) {
      return htmlContent
    }
    // Launch a headless browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

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
