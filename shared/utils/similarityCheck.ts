// Function to split paragraph into lines
function splitIntoLines(paragraph: string): string[] {
  return paragraph.split("\n").map(line => line.trim()).filter(line => line.length > 0)
}

// Function to calculate similarity between two sequences of lines
function calculateSimilarity(linesA: string[], linesB: string[]): number {
  const maxLength = Math.max(linesA.length, linesB.length)
  let matchCount = 0

  for (let i = 0; i < maxLength; i++) {
    if (linesA[i] === linesB[i]) {
      matchCount++
    }
  }

  return matchCount / maxLength // Normalize by the maximum length
}

// Main function to get top 5 similar paragraphs
function getTop5SimilarParagraphs(paragraph: string, databaseParagraphs: string[]): string[] {
  // Preprocess the current paragraph into lines
  const currentLines = splitIntoLines(paragraph)

  // Calculate similarity scores for all paragraphs in the database
  const similarityScores: { paragraph: string, similarity: number }[] = databaseParagraphs.map((dbParagraph) => {
    const paragraphLines = splitIntoLines(dbParagraph)
    return {
      paragraph: dbParagraph,
      similarity: calculateSimilarity(currentLines, paragraphLines),
    }
  })

  // Sort by similarity score in descending order
  similarityScores.sort((a, b) => b.similarity - a.similarity)

  // Get the top 5 most similar paragraphs
  const top5SimilarParagraphs: string[] = similarityScores.slice(0, 5).map(item => item.paragraph)

  return top5SimilarParagraphs
}
