import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  // Fetch the project with all related data
  const evaluation = await prisma.evaluation.findMany({
    where: { projectId: id },
    select: {
      judgement: true,
    },
  })

  return [
    {
      name: "OK",
      color: "green",
      judgement: EVALUATION_JUDGEMENT.OK,
      total: evaluation.filter(f => f.judgement === EVALUATION_JUDGEMENT.OK).length,
    },
    {
      name: "NG",
      judgement: EVALUATION_JUDGEMENT.NG,
      color: "red",
      total: evaluation.filter(f => f.judgement === EVALUATION_JUDGEMENT.NG).length,
    },
    {
      name: "Not Support",
      judgement: EVALUATION_JUDGEMENT.NOT_SUPPORT,
      color: "gray",
      total: evaluation.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length,
    },
    {
      name: "Not Executed",
      judgement: EVALUATION_JUDGEMENT.NOT_EXECUTED,
      total: evaluation.filter(f => f.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length,
    },
  ]
})
