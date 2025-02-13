import type { Evaluation, Project } from "@prisma/client"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import { generateEvaluationSummary, generateTable } from "./table"

export function generateCover(project: Project, evaluations: Evaluation[]) {
  return `
    <div class="report-cover">
        <span>${useRuntimeConfig().public.APP_TITLE} Generated Report</span>
        <span>Project: ${project?.name}</span>
        <span>Model: FY${project?.modelFY} ${project?.modelSeries}-${project?.modelName}</span>
        <span>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span>
        <br/><br/><br/>
        ${generateEvaluationSummary(evaluations)}
    </div>
    `
}

export function generateSummary(evaluations: Evaluation[]) {
  return `
    <div class="report-summary">
        <span>${useRuntimeConfig().public.APP_TITLE} Generated Report</span>
        <span>Total Evaluation Item: ${evaluations?.length}</span>
        <span>OK: ${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.OK).length}</span>
        <span>NG: ${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NG).length}</span>
        <span>Not Executed: ${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length}</span>
        <span>Not Support: ${evaluations.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length}</span>
    </div>
    `
}
