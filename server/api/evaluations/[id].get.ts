import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
  });
  return evaluation || { message: 'evaluation not found' };
});