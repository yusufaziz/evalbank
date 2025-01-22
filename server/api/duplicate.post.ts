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
            checkitem: true,
            attachments: true,
            settings: true,
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
        author: project.author,
        modifier: project.modifier,
        settings: {
          create: project.settings.map(setting => ({
            name: setting.name,
            value: setting.value,
            constrains: setting.constrains,
            author: setting.author,
            modifier: setting.modifier,
          })),
        },
        evaluations: {
          create: project.evaluations.map(evaluation => ({
            judgement: evaluation.judgement,
            remarks: evaluation.remarks,
            author: evaluation.author,
            modifier: evaluation.modifier,
            checkitem: {
              create: {
                module: evaluation.checkitem.module,
                expectedTarget: evaluation.checkitem.expectedTarget,
                settings: {
                  create: evaluation.checkitem.settings.map(setting => ({
                    name: setting.name,
                    value: setting.value,
                    constrains: setting.constrains,
                    author: setting.author,
                    modifier: setting.modifier,
                  })),
                },
                author: evaluation.checkitem.author,
                modifier: evaluation.checkitem.modifier,
              },
            },
            settings: {
              create: evaluation.settings.map(setting => ({
                name: setting.name,
                value: setting.value,
                constrains: setting.constrains,
                author: setting.author,
                modifier: setting.modifier,
              })),
            },
            attachments: {
              create: evaluation.attachments.map(attachment => ({
                filename: attachment.filename,
                author: attachment.author,
                modifier: attachment.modifier,
              })),
            },
          })),
        },
        attachments: {
          create: project.attachments.map(attachment => ({
            filename: attachment.filename,
            author: attachment.author,
            modifier: attachment.modifier,
          })),
        },
      },
    })

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
        author: testcase.author,
        modifier: testcase.modifier,
        checkitems: {
          create: testcase.checkitems.map(checkitem => ({
            module: checkitem.module,
            expectedTarget: checkitem.expectedTarget,
            settings: {
              create: checkitem.settings.map(setting => ({
                name: setting.name,
                value: setting.value,
                constrains: setting.constrains,
                author: setting.author,
                modifier: setting.modifier,
              })),
            },
            author: checkitem.author,
            modifier: checkitem.modifier,
          })),
        },
        attachments: {
          create: testcase.attachments.map(attachment => ({
            filename: attachment.filename,
            author: attachment.author,
            modifier: attachment.modifier,
          })),
        },
      },
    })

    return newTestcase
  }

  throw new Error("Invalid type")
})
