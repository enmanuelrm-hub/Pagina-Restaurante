import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const deliveries = await prisma.delivery.findMany({
    orderBy: { id: 'desc' },
    include: { order: { include: { orderItems: { include: { menuItem: true } } } }, courier: true },
  });
  return NextResponse.json(deliveries);
}

export async function PATCH(request: Request) {
  const { deliveryId, status } = await request.json();
  const delivery = await prisma.delivery.update({
    where: { id: deliveryId },
    data: { status },
  });
  return NextResponse.json(delivery);
}
