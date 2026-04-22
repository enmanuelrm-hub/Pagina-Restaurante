import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const inventory = await prisma.inventoryItem.findMany({
    orderBy: { quantity: 'asc' },
    include: { menuItem: true },
  });
  return NextResponse.json(inventory);
}

export async function PATCH(request: Request) {
  const { inventoryId, quantity } = await request.json();
  const item = await prisma.inventoryItem.update({
    where: { id: inventoryId },
    data: { quantity },
  });
  return NextResponse.json(item);
}
