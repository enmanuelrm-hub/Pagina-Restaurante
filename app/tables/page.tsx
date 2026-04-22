'use client';

import { useEffect, useState } from 'react';

interface Table {
  id: number;
  label: string;
  status: string;
  seats: number;
  orders?: Array<{
    id: number;
    status: string;
  }>;
}

const statusLabels: Record<string, string> = {
  FREE: 'Libre',
  OCCUPIED: 'Ocupada',
  WAITING: 'Esperando pedido',
  SERVED: 'Servida',
};

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    fetch('/api/tables')
      .then((res) => res.json())
      .then((data) => setTables(data.sort((a: Table, b: Table) => parseInt(a.label) - parseInt(b.label))));
  }, []);

  async function changeStatus(tableId: number, status: string) {
    const response = await fetch('/api/tables', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId, status }),
    });
    const updated = await response.json();
    setTables((current) => current.map((table) => (table.id === updated.id ? updated : table)));
  }

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Mesas</p>
            <h1 className="text-3xl font-semibold">Vista de sala en vivo</h1>
          </div>
          <p className="text-sm text-slate-600">Estado en tiempo real de cada mesa y pedido asociado.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => (
            <div key={table.id} className="card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-slate-900">Mesa {table.label}</p>
                  <p className="mt-2 text-sm text-slate-500">{table.seats} asientos</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">{statusLabels[table.status]}</span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {table.orders?.[0] ? (
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold">Último pedido #{table.orders[0].id}</p>
                    <p className="mt-1">Estado: {table.orders[0].status}</p>
                  </div>
                ) : (
                  <p className="rounded-3xl bg-slate-50 p-4">Sin pedidos recientes</p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {['FREE', 'OCCUPIED', 'WAITING', 'SERVED'].map((statusOption) => (
                  <button key={statusOption} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm transition hover:border-slate-900" onClick={() => changeStatus(table.id, statusOption)}>{statusLabels[statusOption]}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
  );
}
