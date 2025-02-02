/**
 * @brief Interface representing a single data point in a chart.
 */
export interface IChartData {
  "name": string | undefined // Name of the category or module
  "OK": number | undefined // Count of evaluations with "OK" judgement
  "NG": number | undefined // Count of evaluations with "NG" judgement
  "Not Executed": number | undefined // Count of evaluations with "NOT_EXECUTED" judgement
  "Not Supported"?: number | undefined // Count of evaluations with "NOT_SUPPORTED" judgement
}

/**
 * @brief Interface representing a chart configuration.
 */
export interface IChart {
  categories: string[] // Categories or labels for the chart
  colors?: string[] // Optional colors for the chart
  data: IChartData[] // Data points for the chart
}
