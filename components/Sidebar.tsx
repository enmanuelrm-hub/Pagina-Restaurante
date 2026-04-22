'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { label: 'Panel', href: '/' },
  { label: 'Pedidos', href: '/orders' },
  { label: 'Cocina', href: '/kitchen' },
  { label: 'Mesas', href: '/tables' },
  { label: 'Inventario', href: '/inventory' },
  { label: 'Domicilios', href: '/delivery' },
  { label: 'Administración', href: '/admin' },
];

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-4 border-r border-slate-200 bg-slate-950 px-5 py-8 text-slate-100 md:flex">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">The Kinetic Command</p>
        <h1 className="mt-4 text-xl font-semibold">Hospitality Cockpit</h1>
        <p className="mt-1 text-sm text-slate-400">Chef de cuisine</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-900 p-4 text-sm text-slate-400">
        {session ? (
          <>
            <p className="text-slate-200">Usuario activo</p>
            <p className="mt-2 font-semibold">{session.user?.name}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{session.user?.role}</p>
            <button onClick={() => signOut()} className="mt-3 w-full rounded-2xl bg-slate-800 px-4 py-2 text-xs">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="block w-full rounded-2xl bg-slate-800 px-4 py-2 text-center text-xs">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </aside>
  );
}
