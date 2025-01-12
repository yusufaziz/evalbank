import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const checkItems = await prisma.checkItem.findMany();
  return checkItems;
});