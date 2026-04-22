import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tables = await prisma.table.findMany({
    orderBy: { label: 'asc' },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  return NextResponse.json(tables);
}

export async function PATCH(request: Request) {
  const { tableId, status } = await request.json();

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    if (status === 'SERVED' && table.orders?.[0]) {
      await tx.order.update({
        where: { id: table.orders[0].id },
        data: { status: 'SERVED' },
      });
    }

    await tx.table.update({
      where: { id: tableId },
      data: { status },
    });
  });

  const updatedTable = await prisma.table.findUnique({
    where: { id: tableId },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  return NextResponse.json(updatedTable);
}
