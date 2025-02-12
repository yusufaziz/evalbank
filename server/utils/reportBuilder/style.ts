import fs from "node:fs"
import path from "node:path"

const stylePath = path.join("shared", "report", "style.css")
const styleData = fs.readFileSync(stylePath, "utf-8")
export const reportStyle = `<style>${styleData}</style>`
