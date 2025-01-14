import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const evaluation = await prisma.evaluation.update({
    where: { id },
    data: body,
  });
  return evaluation;
});
