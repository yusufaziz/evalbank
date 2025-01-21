import prisma from "../../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  // Fetch the project with all related data
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      settings: { select: { id: true, name: true, value: true } },
      attachments: true,
      evaluations: {
        select: {
          id: true,
          judgement: true,
          settings: { select: { id: true, name: true, value: true } },
          checkitem: {
            select: { id: true, module: true, expectedTarget: true, requiredSettings: true, testcase: { select: { id: true, name: true, procedures: true } } },
          },
        },
      },
    },
  })

  if (!project) {
    return { message: "project not found" }
  }

  // Group evaluations by testcase and checkitem
  const testcasesMap = new Map<string, any>()

  project.evaluations.forEach((evaluation) => {
    const testcaseId = evaluation.checkitem?.testcase?.id
    const checkitemId = evaluation.checkitem?.id

    if (!testcaseId || !checkitemId)
      return

    // Initialize testcase if not already in the map
    if (!testcasesMap.has(testcaseId)) {
      testcasesMap.set(testcaseId, {
        ...evaluation.checkitem.testcase,
        checkitems: new Map<string, any>(),
      })
    }

    const testcase = testcasesMap.get(testcaseId)

    // Initialize checkitem if not already in the testcase
    if (!testcase.checkitems.has(checkitemId)) {
      const { testcase: _testcase, ...restCheckitem } = evaluation.checkitem
      testcase.checkitems.set(checkitemId, {
        ...restCheckitem,
        evaluations: [],
      })
    }

    const checkitem = testcase.checkitems.get(checkitemId)

    // Add evaluation to the checkitem
    const { checkitem: _checkitem, ...restEvaluation } = evaluation
    checkitem.evaluations.push({
      ...restEvaluation,
      settings: evaluation.settings,
    })
  })

  // Convert the map to the desired structure
  const testcases = Array.from(testcasesMap.values()).map(testcase => ({
    ...testcase,
    checkitems: Array.from(testcase.checkitems.values()),
  }))

  const { evaluations, ...rest } = project
  // Return the project with the reshaped data
  return {
    ...rest,
    testcases,
  }
})
