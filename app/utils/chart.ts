/**
 * @brief Generates a list of default colors for charts based on the given count.
 *
 * @param count - The number of colors to generate (default is 3).
 * @returns {string[]} An array of HSL color strings.
 */
export function defaultColors(count: number = 3): string[] {
  const quotient = Math.floor(count / 2)
  const remainder = count % 2
  const primaryCount = quotient + remainder
  const secondaryCount = quotient

  const primaryColors = Array.from(Array.from({ length: primaryCount }).keys()).map(i =>
    `hsl(var(--vis-primary-color) / ${1 - (1 / primaryCount) * i})`,
  )

  const secondaryColors = Array.from(Array.from({ length: secondaryCount }).keys()).map(i =>
    `hsl(var(--vis-secondary-color) / ${1 - (1 / secondaryCount) * i})`,
  )

  return [...primaryColors, ...secondaryColors]
}
