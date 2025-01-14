import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const evaluation = await prisma.evaluation.create({
    data: body,
  });
  return evaluation;
});
