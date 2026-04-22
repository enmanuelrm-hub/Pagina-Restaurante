import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultUsers = [
    { name: 'Marcus Vane', email: 'marcus@fullfood.local', password: 'password123', role: 'ADMIN' },
    { name: 'Elena Thorne', email: 'elena@fullfood.local', password: 'password123', role: 'WAITER' },
    { name: 'Carlos Ramirez', email: 'carlos@fullfood.local', password: 'password123', role: 'KITCHEN' },
    { name: 'Sarah Connor', email: 'sarah@fullfood.local', password: 'password123', role: 'COURIER' },
  ];

  for (const userData of defaultUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: userData.password,
        role: userData.role,
      },
      create: userData,
    });
  }

  const tables = [];
  for (let index = 0; index < 10; index++) {
    const tableData = {
      label: `${index + 1}`,
      seats: 4,
      status: index < 4 ? 'OCCUPIED' : 'FREE',
    };
    try {
      const table = await prisma.table.create({ data: tableData });
      tables.push(table);
    } catch (error) {
      // Table already exists, skip
    }
  }

  const menuItems = [];
  const menuData = [
    { name: 'Ribeye a la Pimienta', description: 'Corte de res madurado con salsa de pimienta', price: 42.0, category: 'Fuertes' },
    { name: 'Risotto de Hongos', description: 'Risotto cremoso con hongos silvestres', price: 28.0, category: 'Pastas' },
    { name: 'Tagliatelle a la Trufa', description: 'Pasta artesanal con crema de trufa negra', price: 29.0, category: 'Pastas' },
    { name: 'Salmón del Atlántico', description: 'Salmón glaseado con miel y limón', price: 34.0, category: 'Mariscos' },
  ];
  for (const itemData of menuData) {
    try {
      const item = await prisma.menuItem.create({ data: itemData });
      menuItems.push(item);
    } catch (error) {
      // Item already exists, skip
    }
  }

  const inventoryItems = [];
  const inventoryData = [
    { name: 'Huevos Frescos', quantity: 420, unit: 'pack', lowStockThreshold: 40 },
    { name: 'Aceite de Oliva Extra Virgen', quantity: 4.5, unit: 'litro', lowStockThreshold: 6 },
    { name: 'Vainas de Vainilla', quantity: 0.8, unit: 'kg', lowStockThreshold: 2 },
    { name: 'Harina para Masa Madre', quantity: 12, unit: 'kg', lowStockThreshold: 8 },
    { name: 'Filetes de Salmón', quantity: 28, unit: 'kg', lowStockThreshold: 10 },
  ];
  for (const itemData of inventoryData) {
    try {
      const item = await prisma.inventoryItem.create({ data: itemData });
      inventoryItems.push(item);
    } catch (error) {
      // Item already exists, skip
    }
  }

  console.log('Seed data completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
