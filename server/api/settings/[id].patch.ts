import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const setting = await prisma.setting.update({
    where: { id },
    data: body,
  });
  return setting;
});
