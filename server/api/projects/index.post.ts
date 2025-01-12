import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const project = await prisma.project.create({
    data: body,
  });
  return project;
});