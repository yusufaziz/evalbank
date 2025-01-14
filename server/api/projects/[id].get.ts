import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const project = await prisma.project.findUnique({
    where: { id },
  });
  return project || { message: "project not found" };
});
