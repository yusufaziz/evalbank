import { connect } from "node:http2"
import { defineEventHandler, readBody } from "h3"
import prisma from "../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { type, id } = body

  if (type === "projects") {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        settings: true,
        evaluations: {
          include: {
            testcase: {
              select: { id: true },
            },
          },
        },
        attachments: true,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    const newProject = await prisma.project.create({
      data: {
        name: `${project.name} (Copy)`,
        modelFY: project.modelFY,
        modelSeries: project.modelSeries,
        modelName: project.modelName,
        settings: {
          connect: project.settings.map(setting => ({ id: setting.id })),
        },
        attachments: {
          connect: project.attachments.map(attachment => ({ id: attachment.id })),
        },
      },
    })
    const testcaseIds = [...new Set(project.evaluations.map(evaluation => evaluation.testcase?.id))]
    testcaseIds.forEach(testcaseId => regenerateEvaluations(testcaseId || "", newProject.id))

    return newProject
  }

  if (type === "testcases") {
    const testcase = await prisma.testcase.findUnique({
      where: { id },
      include: {
        checkitems: {
          include: {
            settings: true, // Include settings for checkitems
          },
        },
        attachments: true,
      },
    })

    if (!testcase) {
      throw new Error("Testcase not found")
    }

    const newTestcase = await prisma.testcase.create({
      data: {
        name: `${testcase.name} (Copy)`,
        procedures: testcase.procedures,
        attachments: {
          connect: testcase.attachments.map(attachment => ({ id: attachment.id })),
        },
      },
    })

    await prisma.$transaction(testcase.checkitems.map((checkitem) => {
      return prisma.checkitem.create({
        data: {
          module: checkitem.module,
          expectedTarget: checkitem.expectedTarget,
          testcaseId: newTestcase.id,
          settings: {
            connect: checkitem.settings.map(setting => ({ id: setting.id })),
          },
        },
      })
    }))

    return newTestcase
  }

  throw new Error("Invalid type")
})
