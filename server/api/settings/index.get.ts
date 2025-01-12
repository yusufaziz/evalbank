import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const settings = await prisma.setting.findMany();
  return settings;
});