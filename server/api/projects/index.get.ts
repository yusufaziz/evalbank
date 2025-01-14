import prisma from "../../../plugins/prisma.client";

export default defineEventHandler(async (event) => {
  const projects = await prisma.project.findMany();
  return projects;
});
