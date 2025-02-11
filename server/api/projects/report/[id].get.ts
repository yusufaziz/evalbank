import { Readable } from "node:stream"
import { defineEventHandler } from "h3"
import puppeteer from "puppeteer"

export default defineEventHandler(async (event) => {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const htmlContent = `
        <html>
            <head>
            <style>
                body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                }
                h1 {
                color: #333;
                }
                table {
                width: 100%;
                border-collapse: collapse;
                page-break-inside: auto; /* Allow table to split across pages */
                }
                th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                }
                thead {
                display: table-header-group; /* Repeat header on each page */
                }
                tbody {
                display: table-row-group;
                }
                tr {
                page-break-inside: avoid; /* Prevent rows from splitting across pages */
                }
            </style>
            </head>
            <body>
            <h1>Table with Repeated Headers</h1>
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
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
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
