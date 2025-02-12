import type { Project } from "@prisma/client"

export function generateCover(project: Project) {
  return `
    <div class="report-cover">
        <span>${useRuntimeConfig().public.APP_TITLE} Generated Report</span>
        <span>Project: ${project?.name}</span>
        <span>Model: FY${project?.modelFY} ${project?.modelSeries}-${project?.modelName}</span>
        <span>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span>
    </div>
    `
}
