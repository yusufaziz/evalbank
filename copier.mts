import { execSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"
import process from "node:process"
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

    // Commit changes in the destination directory
    await commitChangesInDestination(destDir, srcDir)
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

/**
 * Commits changes in the destination directory using the latest commit message from the source directory.
 *
 * @param destDir - The destination directory where changes need to be committed.
 * @param srcDir - The source directory to fetch the latest commit message.
 */
async function commitChangesInDestination(destDir: string, srcDir: string): Promise<void> {
  try {
    let commitmessage = "latest commit"
    if (process.argv.length > 2) {
      // Get commit message from command line if the parameter exist
      commitmessage = process.argv[3] || "latest commit"
    }
    else {
      // Get the latest commit message from the source directory
      commitmessage = execSync("git log -1 --pretty=%B", { cwd: srcDir }).toString().trim()
    }

    consola.info("File will be commited with message: ", commitmessage)

    // Stage all changes in the destination directory
    execSync("git add .", { cwd: destDir })

    // Commit the changes with the latest commit message
    execSync(`git commit -m "${commitmessage}"`, { cwd: destDir })

    // Push the changes to origin
    execSync(`git push`, { cwd: destDir })

    consola.log("Changes committed successfully in the destination directory!")
  }
  catch (error) {
    consola.error("Error committing changes in the destination directory:", error)
  }
}

// Example usage
const sourceDir = path.join(process.cwd(), ".")
const destinationDir = path.join(process.cwd(), "../testpoint_local")

copyFolderExcludingGitignore(sourceDir, destinationDir)
