const fs = require("fs");
const path = require("path");

// Define the tables and their API methods
const tables = ["projects", "testCases", "checkItems", "settings", "evaluations"];
const apiMethods = [
  { method: "get", fileName: "index.get.ts" }, // Get all records
  { method: "getById", fileName: "[id].get.ts" }, // Get a single record by ID
  { method: "post", fileName: "index.post.ts" }, // Create a record
  { method: "patch", fileName: "[id].patch.ts" }, // Update a record
  { method: "delete", fileName: "[id].delete.ts" }, // Delete a record
];

// Base directory for the API files
const baseDir = path.join(__dirname, "server", "api");

// Create the base directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Function to generate the content for each API file
const generateContent = (table, method) => {
  const singularTable = table.slice(0, -1); // Remove the trailing 's' for variable names

  switch (method) {
    case "get":
      return `import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const ${table} = await prisma.${singularTable}.findMany();
  return ${table};
});`;

    case "getById":
      return `import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const ${singularTable} = await prisma.${singularTable}.findUnique({
    where: { id },
  });
  return ${singularTable} || { message: '${singularTable} not found' };
});`;

    case "post":
      return `import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const ${singularTable} = await prisma.${singularTable}.create({
    data: body,
  });
  return ${singularTable};
});`;

    case "patch":
      return `import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const ${singularTable} = await prisma.${singularTable}.update({
    where: { id },
    data: body,
  });
  return ${singularTable};
});`;

    case "delete":
      return `import prisma from '../../../plugins/prisma.client';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  await prisma.${singularTable}.delete({
    where: { id },
  });
  return { message: '${singularTable} deleted successfully' };
});`;

    default:
      return "";
  }
};

// Generate files for each table and method
tables.forEach((table) => {
  const tableDir = path.join(baseDir, table);
  if (!fs.existsSync(tableDir)) {
    fs.mkdirSync(tableDir, { recursive: true });
  }

  apiMethods.forEach(({ method, fileName }) => {
    const filePath = path.join(tableDir, fileName);
    const content = generateContent(table, method);

    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
  });
});

console.log("API files generated successfully!");
