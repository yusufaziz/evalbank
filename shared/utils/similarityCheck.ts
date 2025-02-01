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
 * @details Similarity is determined by comparing corresponding lines and normalizing by the maximum length.
 * @param linesA - The first sequence of lines.
 * @param linesB - The second sequence of lines.
 * @returns A number between 0 and 1 representing the similarity score.
 */
function calculateSimilarity(linesA: string[], linesB: string[]): number {
  if (!Array.isArray(linesA) || !Array.isArray(linesB)) {
    throw new TypeError("Invalid input: Both inputs must be arrays of strings.")
  }

  const maxLength = Math.max(linesA.length, linesB.length)
  if (maxLength === 0) {
    return 0 // No lines to compare
  }

  let matchCount = 0
  for (let i = 0; i < maxLength; i++) {
    if (linesA[i] === linesB[i]) {
      matchCount++
    }
  }

  return matchCount / maxLength // Normalize by the maximum length
}

/**
 * @brief Retrieves the top 5 most similar paragraphs from a database based on line-by-line comparison.
 * @details This function preprocesses the input paragraph and calculates similarity scores for all database paragraphs.
 * @param paragraph - The input paragraph to compare against the database.
 * @param databaseParagraphs - An array of paragraphs from the database.
 * @returns An array of the top 5 most similar paragraphs.
 * @throws Error if the input paragraph or database paragraphs are invalid.
 */
export function getTop5SimilarParagraphs(paragraph: string, databaseParagraphs: string[]): string[] {
  try {
    // Validate inputs
    if (!paragraph || typeof paragraph !== "string") {
      throw new Error("Invalid input: Paragraph must be a non-empty string.")
    }
    if (!Array.isArray(databaseParagraphs) || databaseParagraphs.some(p => typeof p !== "string")) {
      throw new Error("Invalid input: Database paragraphs must be an array of strings.")
    }

    // Preprocess the current paragraph into lines
    const currentLines = splitIntoLines(paragraph)

    // Calculate similarity scores for all paragraphs in the database
    const similarityScores = databaseParagraphs.map((dbParagraph) => {
      const paragraphLines = splitIntoLines(dbParagraph)
      return {
        paragraph: dbParagraph,
        similarity: calculateSimilarity(currentLines, paragraphLines),
      }
    })

    // Sort by similarity score in descending order
    similarityScores.sort((a, b) => b.similarity - a.similarity)

    // Get the top 5 most similar paragraphs
    const top5SimilarParagraphs = similarityScores.slice(0, 5).map(item => item.paragraph)

    return top5SimilarParagraphs
  }
  catch (error) {
    console.error(`Error in getTop5SimilarParagraphs: ${(error as Error).message}`)
    throw error
  }
}
