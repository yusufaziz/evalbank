import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const testCase = await prisma.testCase.create({
    data: body,
  });
  return testCase;
});
