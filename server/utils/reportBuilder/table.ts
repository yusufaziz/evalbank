import type { IEvaluation } from "~~/shared/interface/evaluation"
import consola from "consola"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"

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
function buildSummaryRow(title: string, evaluations: IEvaluation[]) {
  consola.log("Evaluation", title, evaluations.length)
  return `
  <tr>
      <td rowspan=4>${title}</td>
      <td>OK</td>
      <td>${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.OK).length}</td>
    </tr>
    <tr>
      <td>NG</td>
      <td>${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NG).length}</td>
    </tr>
    <tr>
      <td>Not Support</td>
      <td>${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length}</td>
    </tr>
    <tr>
      <td>Not Executed</td>
      <td>${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length}</td>
    </tr>
    `
}
export function generateEvaluationSummary(evaluations: IEvaluation[]) {
  const modules = [...new Set(evaluations.flatMap(f => f.checkitem?.module))]
  consola.log(evaluations)
  consola.log(modules)
  return `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Judgement</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
      ${buildSummaryRow("Total", evaluations)}
      ${modules.map((m) => {
        const filteredEvaluations = evaluations.filter(f => f.checkitem?.module.startsWith(m as string))
        consola.log(m, evaluations.length, filteredEvaluations.length)
        return buildSummaryRow(m as string, filteredEvaluations)
      }).join("")}
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
