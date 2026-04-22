import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const cards = [
  { label: 'Pedidos', href: '/orders', description: 'Registro y seguimiento de pedidos en tiempo real.' },
  { label: 'Cocina', href: '/kitchen', description: 'Ordene y controle el flujo de cocina.' },
  { label: 'Mesas', href: '/tables', description: 'Gestión de mesas y estados de servicio.' },
  { label: 'Inventario', href: '/inventory', description: 'Control de insumos, stock y alertas.' },
  { label: 'Domicilios', href: '/delivery', description: 'Pedidos de entrega y estado de reparto.' },
  { label: 'Administración', href: '/admin', description: 'Ventas diarias, reportes y finanzas.' },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="px-6 py-8">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Cockpit de Hospitalidad</p>
            <h1 className="text-4xl font-semibold text-slate-900">Monitor operativo central</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>Usuario: <strong>{session?.user?.name || 'No logueado'}</strong></span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Rol: {session?.user?.role || 'N/A'}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="card p-6">
            <p className="text-sm uppercase text-slate-500">Ventas del día</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">$0</p>
            <p className="mt-2 text-sm text-slate-500">Sin operaciones</p>
          </div>
          <div className="card p-6">
            <p className="text-sm uppercase text-slate-500">Pedidos activos</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">0</p>
            <p className="mt-2 text-sm text-slate-500">Sin actividad</p>
          </div>
          <div className="card p-6">
            <p className="text-sm uppercase text-slate-500">Mesas ocupadas</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">0/10</p>
            <p className="mt-2 text-sm text-slate-500">Todas libres</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card block p-6 transition hover:-translate-y-0.5 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">{card.label}</h2>
            <p className="mt-3 text-slate-600">{card.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Abrir módulo →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
