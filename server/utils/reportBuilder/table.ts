import type { IEvaluation } from "~~/shared/interface/evaluation"

export interface IReportTableParam {
  headers: string
  fields: string
  // eslint-disable-next-line ts/no-unsafe-function-type
  format?: Function
}
export function generateTable(param: IReportTableParam[], datas: any[]) {
  return `
  <table>
    <thead>
    <tr>
    ${param.map((p) => {
      return `<th>${p.headers}</th>`
    }).join("")}
    </tr>
    </thead>
    <tbody>
    ${
      datas.map((d, _ie) => {
        return `
        <tr>
        ${param.map((p) => {
          return `<td>${(p.format ? p.format(d[p?.fields]) : d[p.fields])}</td>`
        }).join("")}
        </tr>
        `
      }).join("")
    }
    </tbody>
    </table>
`
}
export function generateEvaluationTable(evaluations: IEvaluation[]) {
  const settingCount = evaluations.at(1)?.settings?.length
  const settings = evaluations.at(1)?.settings?.sort((a, b) => a.name.localeCompare(b.name))
  return `
    <table>
      <thead>
      <tr>
        <th colspan="${settingCount}">Settings</th>
        <th rowspan="2">Settings</th>
        <th rowspan="2">Remarks</th>
      </tr>
      <tr>
        ${settings?.map((s) => {
          return `<th>${s.name}</th>`
        }).join("")}
      </tr>
      </thead>
      <tbody>
      ${
        evaluations.map((evaluation, _ie) => {
          return `
          <tr>
          ${settings?.map((s) => {
            return `
            <td>${evaluation.settings?.find(f => f.name === s.name)?.value || "-"}</td>
          `
          }).join("")}
          <td>${evaluation.judgement}</td>
          <td>${evaluation.remarks || ""}</td>
          </tr>
          `
        }).join("")
      }
      </tbody>
      </table>
  `
}
