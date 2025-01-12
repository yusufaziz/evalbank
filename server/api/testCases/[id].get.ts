import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const testCase = await prisma.testCase.findUnique({
    where: { id },
  });
  return testCase || { message: 'testCase not found' };
});