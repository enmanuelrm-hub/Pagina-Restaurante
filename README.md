# Full Food Hospitality

Sistema de gestión de ventas para restaurantes construido con Next.js, Tailwind CSS y SQLite via Prisma.

## Funcionalidades incluidas

- Registro de pedidos en tiempo real.
- Creación de pedidos personalizados con notas y tipos (local, para llevar, domicilios).
- Módulo de cocina con cronología, estados y alertas de espera.
- Gestión de mesas con estados de sala en vivo.
- Control de inventario con actualización de stock y alertas de bajo nivel.
- Gestión de domicilios con estados de entrega.
- Módulo administrativo con reportes de ventas e indicadores.
- Autenticación de usuarios con roles (Admin, Mesero, Cocina, Domiciliario).

## Tecnologías

- Next.js
- TypeScript
- Tailwind CSS
- SQLite
- Prisma
- NextAuth.js

## Instalación y Ejecución

1. Asegúrate de tener Node.js instalado (versión 18+).
2. Copia `.env.example` a `.env`.
3. Ejecuta el script de instalación:

```bash
run.bat
```

O manualmente:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

4. Accede a `http://localhost:3000/auth/signin` para iniciar sesión.

## Usuarios de prueba

- **Admin**: marcus@fullfood.local / password123
- **Mesero**: elena@fullfood.local / password123
- **Cocina**: carlos@fullfood.local / password123
- **Domiciliario**: sarah@fullfood.local / password123

## Notas

- El backend está en `app/api/*`.
- Las páginas del sistema se encuentran en `app/orders`, `app/kitchen`, `app/tables`, `app/inventory`, `app/delivery` y `app/admin`.
- El proyecto usa SQLite para simplicidad; la DB se crea en `prisma/dev.db`.

## Notas

- El backend está en `app/api/*`.
- Las páginas del sistema se encuentran en `app/orders`, `app/kitchen`, `app/tables`, `app/inventory`, `app/delivery` y `app/admin`.
- El proyecto está preparado para PostgreSQL; actualiza la cadena de conexión en `.env`.
