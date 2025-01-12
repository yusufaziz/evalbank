import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const testCase = await prisma.testCase.update({
    where: { id },
    data: body,
  });
  return testCase;
});