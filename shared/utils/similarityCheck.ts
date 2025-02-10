import type { Testcase } from "@prisma/client"
import consola from "consola"
import stringSimilarity from "string-similarity"

/**
 * @brief Splits a paragraph into lines, trimming whitespace and filtering out empty lines.
 * @param paragraph - The input paragraph to split.
 * @returns An array of non-empty, trimmed lines.
 */
function splitIntoLines(paragraph: string): string[] {
  if (!paragraph || typeof paragraph !== "string") {
    throw new Error("Invalid input: Paragraph must be a non-empty string.")
  }
  return paragraph.split("\n").map(line => line.trim()).filter(line => line.length > 0)
}

/**
 * @brief Calculates the similarity between two sequences of lines.
 * @details Similarity is determined using the `string-similarity` library and normalized by the maximum length.
 * @param linesA - The first sequence of lines.
 * @param linesB - The second sequence of lines.
 * @returns A number between 0 and 1 representing the similarity score, rounded to 3 decimal places.
 */
function calculateSimilarity(linesA: string[], linesB: string[]): number {
  if (!Array.isArray(linesA) || !Array.isArray(linesB)) {
    throw new TypeError("Invalid input: Both inputs must be arrays of strings.")
  }

  const maxLength = Math.max(linesA.length, linesB.length)
  if (maxLength === 0) {
    return 0 // No lines to compare
  }

  let totalSimilarity = 0
  for (let i = 0; i < maxLength; i++) {
    const lineA = linesA[i]?.toLowerCase() || ""
    const lineB = linesB[i]?.toLowerCase() || ""
    const similarity = stringSimilarity.compareTwoStrings(lineA, lineB)
    totalSimilarity += similarity
  }

  const averageSimilarity = totalSimilarity / maxLength
  return Number.parseFloat(averageSimilarity.toFixed(3)) // Ensure 3 decimal places
}

/**
 * @brief Retrieves the top 5 most similar test cases from a database based on line-by-line comparison.
 * @details This function preprocesses the input paragraph and calculates similarity scores for all database test cases.
 * @param paragraph - The input paragraph to compare against the database.
 * @param databaseTestCases - An array of test cases from the database.
 * @returns An array of the top 5 most similar test cases.
 * @throws Error if the input paragraph or database test cases are invalid.
 */
export function getTop5SimilarParagraphs(
  paragraph: string,
  databaseTestCases: Partial<Testcase>[],
): Partial<Testcase>[] {
  try {
    // Validate inputs
    if (!paragraph || typeof paragraph !== "string") {
      throw new Error("Invalid input: Paragraph must be a non-empty string.")
    }
    if (!Array.isArray(databaseTestCases) || databaseTestCases.some(tc => typeof tc.procedures !== "string")) {
      throw new Error("Invalid input: Database test cases must be an array of objects with a 'procedures' field.")
    }

    // Preprocess the current paragraph into lines
    const currentLines = splitIntoLines(paragraph)

    // Calculate similarity scores for all test cases in the database
    const similarityScores = databaseTestCases.map((testCase) => {
      const paragraphLines = splitIntoLines(testCase.procedures)
      return {
        testCase, // Store the entire test case object
        similarity: calculateSimilarity(currentLines, paragraphLines),
      }
    })

    // Sort by similarity score in descending order
    consola.log(similarityScores)
    similarityScores.sort((a, b) => b.similarity - a.similarity)

    // Get the top 5 most similar test cases
    const top5SimilarTestCases = similarityScores.slice(0, 5).map(item => item.testCase)

    return top5SimilarTestCases
  }
  catch (error) {
    console.error(`Error in getTop5SimilarParagraphs: ${(error as Error).message}`)
    throw error
  }
}
