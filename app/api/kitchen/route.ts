import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      orderItems: { include: { menuItem: true } },
      table: true,
    },
    where: {
      status: { in: ['PENDING', 'PREPARING'] },
    },
  });
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  const { orderId, status } = await request.json();
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return NextResponse.json(order);
}
