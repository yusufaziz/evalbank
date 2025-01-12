import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const testCases = await prisma.testCase.findMany();
  return testCases;
});