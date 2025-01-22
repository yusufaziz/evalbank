import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  // Step 1: Extract query parameters
  const query = getQuery(event)
  const projectId = query.projectId as string | undefined

  let testcases

  // Step 2: Check if projectId is provided
  if (projectId) {
    // Step 3: Fetch testcases NOT associated with the given projectId
    testcases = await prisma.testcase.findMany({
      where: {
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
