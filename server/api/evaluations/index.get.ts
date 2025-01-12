import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const evaluations = await prisma.evaluation.findMany();
  return evaluations;
});