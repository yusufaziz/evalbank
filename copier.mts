import * as fs from "node:fs"
import * as path from "node:path"
import { consola } from "consola"
import ignore from "ignore"

/**
 * Copies the contents of a source folder to a destination folder,
 * excluding files and directories listed in .gitignore.
 *
 * @param srcDir - The source directory to copy from.
 * @param destDir - The destination directory to copy to.
 */
async function copyFolderExcludingGitignore(srcDir: string, destDir: string): Promise<void> {
  try {
    // Read the .gitignore file
    const gitignorePath = path.join(srcDir, ".gitignore")
    let ignoreRules = ""

    if (fs.existsSync(gitignorePath)) {
      ignoreRules = fs.readFileSync(gitignorePath, "utf-8")
    }

    // Create an ignore instance and add the rules
    const ig = ignore().add(ignoreRules)

    // Ensure the destination directory exists
    ensureDirSync(destDir)

    // Recursively copy files and directories
    await copyDirectory(srcDir, destDir, ig)

    consola.log("Folder copied successfully!")
  }
  catch (error) {
    consola.error("Error copying folder:", error)
  }
}

/**
 * Recursively copies a directory, excluding files and directories
 * that match the .gitignore rules.
 *
 * @param src - The source directory.
 * @param dest - The destination directory.
 * @param ig - The ignore instance with .gitignore rules.
 */
async function copyDirectory(src: string, dest: string, ig: any): Promise<void> {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    // Check if the file/directory is ignored
    const relativePath = path.relative(src, srcPath)
    if (ig.ignores(relativePath)) {
      consola.log(`Ignoring: ${relativePath}`)
      continue
    }

    if (entry.isDirectory()) {
      // Recursively copy directories
      ensureDirSync(destPath)
      await copyDirectory(srcPath, destPath, ig)
    }
    else if (entry.isFile()) {
      // Copy files
      fs.copyFileSync(srcPath, destPath)
      consola.log(`Copied: ${relativePath}`)
    }
  }
}

/**
 * Ensures a directory exists, creating it if necessary.
 *
 * @param dirPath - The directory path to ensure.
 */
function ensureDirSync(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Example usage
const sourceDir = path.join(__dirname, ".")
const destinationDir = path.join(__dirname, "../testpoint2")

copyFolderExcludingGitignore(sourceDir, destinationDir)
