import type { Buffer } from "node:buffer"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import consola from "consola"

export async function saveAttachment(buffer: Buffer<ArrayBufferLike>, id: string, extension: string) {
  // Save the file to the public/attachment folder with the attachment ID as the filename
  const attachmentPath = path.join(process.cwd(), "public", "attachments")
  if (!fs.existsSync(attachmentPath)) {
    await fs.mkdirSync(attachmentPath)
  }
  const filePath = path.join(attachmentPath, `${id}.${extension}`)
  consola.log(`Saving attachment to: ${filePath}`)
  await fs.writeFileSync(filePath, buffer)
}
