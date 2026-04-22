const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: { include: { menuItem: true } },
      table: true,
      delivery: true,
      waiter: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log(JSON.stringify(orders, null, 2));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});