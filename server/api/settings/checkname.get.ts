import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (query.name) {
    const setting = await prisma.setting.count({
      where: { name: { contains: query.name.toString() } },
    })
    if (setting > 0) {
      return "Setting name exist in database, new value will be added"
    }
    else {
      return "There are no setting name yet in database, new name will be added"
    }
  }
  else {
    return "Please fill name parameter"
  }
})
