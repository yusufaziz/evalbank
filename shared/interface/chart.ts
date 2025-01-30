export interface IChartData {
  "name": string
  "OK": number
  "NG": number
  "Not Executed": number
}

export interface IChart {
  categories: string[]
  colors?: string[]
  data: IChartData[]
}
