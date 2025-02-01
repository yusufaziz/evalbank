import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import consola from "consola"

// Function to append all .ts files from given directories into multiple .txt files with a max length of 10,000 characters
function generateFile(outputFileNameBase: string, directories: string[]): void {
  const maxChunkSize = 10000
  let currentChunkContent = ""
  let partNumber = 1

  // Helper function to write the current chunk to a file and reset the content
  const writeChunkToFile = () => {
    const outputFileName = `${outputFileNameBase}_part${partNumber}.txt`
    fs.writeFileSync(outputFileName, currentChunkContent)
    consola.success(`Generated file: ${outputFileName}`)
    currentChunkContent = "" // Reset content for the next part
    partNumber++
  }

  // Collect all .ts files and their contents
  directories.forEach((dir) => {
    const fullPath = path.resolve(dir)
    if (!fs.existsSync(fullPath)) {
      consola.warn(`Directory ${dir} does not exist.`)
      return
    }

    const files = getAllFiles(fullPath)
    files.forEach((file) => {
      const relativePath = path.relative(process.cwd(), file)
      const code = fs.readFileSync(file, "utf-8")
      const fileBlock = `-------------------------------\nfile : ${relativePath}\ncode : \n${code}\n`

      // Check if adding this file block exceeds the max chunk size
      if (currentChunkContent.length + fileBlock.length > maxChunkSize) {
        // Write the current chunk to a file before starting a new one
        writeChunkToFile()
      }

      // Append the file block to the current chunk
      currentChunkContent += fileBlock
    })
  })

  // Write any remaining content to a final file
  if (currentChunkContent.length > 0) {
    writeChunkToFile()
  }
}

// Function to get all .ts files recursively from a directory
function getAllFiles(dir: string): string[] {
  let files: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath))
    }
    else if (item.isFile() && !item.path.includes("Ui") && path.extname(item.name) === ".vue") {
      files.push(fullPath)
    }
  }

  return files
}

// Function to reverse the process and decode the generated .txt files back into individual files
function reverseGenerate(inputFileNames: string[]): void {
  inputFileNames.forEach((inputFileName) => {
    const data = fs.readFileSync(inputFileName, "utf-8")
    const fileBlocks = data.split("-------------------------------\n")

    fileBlocks.forEach((block) => {
      if (!block.trim())
        return

      const lines = block.split("\n")
      const filePathLine = lines[0]
      const codeLines = lines.slice(2) // Skip "file : " and "code : " lines

      const filePath = filePathLine.replace("file : ", "")
      const code = codeLines.join("\n")

      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(filePath, code)
      consola.success(`Restored file: ${filePath}`)
    })
  })
}

// Main logic
if (process.argv.length < 4) {
  consola.error("Usage: ts-node generateFile.ts <outputFileNameBase> <directory1> <directory2> ...")
  process.exit(1)
}

const outputFileNameBase = process.argv[2]
const directories = process.argv.slice(3)

if (outputFileNameBase === "reverse") {
  const inputFileNames = directories
  reverseGenerate(inputFileNames)
}
else {
  generateFile(outputFileNameBase, directories)
}
