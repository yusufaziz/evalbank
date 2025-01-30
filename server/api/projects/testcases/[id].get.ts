import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  // Ensure `id` is defined
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    })
  }

  // Fetch the evaluation data
  const evaluation = await prisma.evaluation.groupBy({
    by: ["testcaseId", "checkitemId"],
    _count: {
      id: true,
    },
    where: {
      projectId: id,
    },
  })

  if (!evaluation || evaluation.length === 0) {
    return { message: "No evaluation related to project" }
  }

  // Transform the data into the desired structure
  let totalCount = 0 // Initialize total count

  const testcases = evaluation.reduce((acc, item) => {
    const { testcaseId, checkitemId, _count } = item

    // Ensure `testcaseId` and `checkitemId` are not null
    if (!testcaseId || !checkitemId) {
      return acc // Skip entries with null values
    }

    // Find or create an entry for the testcaseId
    let testcaseEntry = acc.find(entry => entry.testcaseId === testcaseId)
    if (!testcaseEntry) {
      testcaseEntry = { testcaseId, checkitems: [] }
      acc.push(testcaseEntry)
    }

    // Add the checkitemId and count to the testcase entry
    testcaseEntry.checkitems.push({ checkitemId, count: _count.id })

    // Add to the total count
    totalCount += _count.id

    return acc
  }, [] as { testcaseId: string, checkitems: { checkitemId: string, count: number }[] }[])

  /** Build Chart data */
  const chartEval = await prisma.evaluation.findMany({
    where: { projectId: id },
    select: {
      judgement: true,
      checkitem: {
        select: {
          module: true,
        },
      },
    },
  })

  const chartData = [...new Set(chartEval.map(e => e.checkitem?.module))].map((module) => {
    return {
      "name": module,
      "OK": chartEval.filter(e => e.checkitem?.module === module && e.judgement === EVALUATION_JUDGEMENT.OK).length,
      "NG": chartEval.filter(e => e.checkitem?.module === module && e.judgement === EVALUATION_JUDGEMENT.NG).length,
      "Not Executed": chartEval.filter(e => e.checkitem?.module === module && e.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length,
    }
  })

  // Return the transformed data with totalCount
  return {
    testcases,
    totalCount,
    chart: {
      categories: ["OK", "NG", "Not Executed"],
      colors: ["Green", "Red", "Gray"],
      data: chartData || [],
    },
  }
})
