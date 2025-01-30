import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  // Step 1: Extract query parameters
  const query = getQuery(event)
  const projectId = query.projectId as string | undefined

  let testcases

  const filters: any = { AND: [
    {
      // Exclude testcases linked to the projectId through checkitems and evaluations
      checkitems: {
        none: {
          evaluations: {
            some: {
              projectId,
            },
          },
        },
      },
    },
  ] }

  if (query.search) {
    filters.AND.push({
      OR: [
        { name: { contains: query.search } },
        { group: { contains: query.search } },
        { procedures: { contains: query.search } },
        { checkitems: { some: { module: { contains: query.search } } } },
        { checkitems: { some: { expectedTarget: { contains: query.search } } } },
        { checkitems: { some: { settings: { some: { name: { contains: query.search } } } } } },
        { checkitems: { some: { settings: { some: { value: { contains: query.search } } } } } },
      ],
    })
  }

  // Step 2: Check if projectId is provided
  if (projectId) {
    // Step 3: Fetch testcases NOT associated with the given projectId
    testcases = await prisma.testcase.findMany({
      where: filters,
      include: {
        checkitems: true, // Include related checkitems
        attachments: true, // Include related attachments
      },
    })
  }
  else {
    // Step 4: If no projectId is provided, fetch all testcases
    testcases = await prisma.testcase.findMany({
      include: {
        checkitems: {
          include: { settings: true },
        }, // Include related checkitems
        attachments: true, // Include related attachments
      },
    })
  }

  // Step 5: Return the filtered or unfiltered testcases
  return testcases
})
