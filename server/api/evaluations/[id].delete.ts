import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  await prisma.evaluation.delete({
    where: { id },
  });
  return { message: "evaluation deleted successfully" };
});
