const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menuItems = await prisma.menuItem.findMany({ orderBy: { id: 'asc' } });
  console.log(JSON.stringify(menuItems, null, 2));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});