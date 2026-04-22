import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: { include: { menuItem: true } },
      table: true,
      waiter: true,
      delivery: true,
    },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, tableId, waiterId, note, items, deliveryAddress } = body;

  const orderItems = items.map((item: any) => ({
    menuItemId: item.menuItemId,
    quantity: item.quantity || 1,
    specialNote: item.specialNote || null,
  }));

  const selectedItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((item: any) => item.menuItemId) } },
  });
  const total = selectedItems.reduce((sum, item) => {
    const quantity = items.find((row: any) => row.menuItemId === item.id)?.quantity || 1;
    return sum + item.price * quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        type,
        note,
        tableId: type === 'DINE_IN' ? tableId ?? undefined : undefined,
        waiterId: waiterId || undefined,
        total,
        orderItems: {
          create: orderItems,
        },
        delivery: type === 'DELIVERY' ? { create: { address: deliveryAddress, status: 'ASSIGNED' } } : undefined,
      },
      include: {
        orderItems: true,
        delivery: true,
        table: true,
        waiter: true,
      },
    });

    if (type === 'DINE_IN' && tableId) {
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'WAITING' },
      });
    }

    return createdOrder;
  });

  return NextResponse.json(order);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { orderId, status } = body;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { orderItems: { include: { menuItem: true } }, table: true, delivery: true },
  });

  return NextResponse.json(order);
}
