import type { TaskEvent } from "nitropack/types"

import type { IEvaluationItems } from "~~/shared/interface/evaluation"
import consola from "consola"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../plugins/prisma.client"

export default defineTask({
  meta: {
    name: "evaluation:sync",
    description: "Synchronize evaluation settings",
  },
  async run(event: TaskEvent) {
    const payload = event.payload as IEvaluationItems // Cast the payload to IEvaluationItems

    consola.log("Synchronize evaluation settings")
    consola.log(payload)

    // Delete evaluations
    if (payload.deleteIds.length > 0) {
      await prisma.evaluation.deleteMany({
        where: {
          id: {
            in: payload.deleteIds,
          },
        },
      })
    }

    // Update evaluations to NOT_SUPPORT
    if (payload.not_supportIds.length > 0) {
      await prisma.evaluation.updateMany({
        where: {
          id: {
            in: payload.not_supportIds,
          },
        },
        data: {
          judgement: EVALUATION_JUDGEMENT.NOT_SUPPORT,
        },
      })
    }

    // Create new evaluations
    await prisma.$transaction(
      payload.new.map((evaluation) => {
        return prisma.evaluation.create({
          data: {
            judgement: evaluation.judgement,
            projectId: evaluation.projectId,
            checkitemId: evaluation.checkitemId,
            testcaseId: evaluation.testcaseId,
            settings: { connect: evaluation.settings.map(id => ({ id })) },
          },
        })
      }),
    )

    return { result: "Success" }
  },
})
