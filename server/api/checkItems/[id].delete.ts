import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  await prisma.checkItem.delete({
    where: { id },
  });
  return { message: "checkItem deleted successfully" };
});
