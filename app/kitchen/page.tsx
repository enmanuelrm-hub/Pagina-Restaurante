'use client';

import { useEffect, useState } from 'react';

function elapsedMinutes(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.floor(diff / 60000);
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/kitchen')
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  async function updateStatus(orderId: number, status: string) {
    await fetch('/api/kitchen', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    // Recargar la lista completa después de actualizar
    fetch('/api/kitchen')
      .then((res) => res.json())
      .then(setOrders);
  }

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Cocina</p>
            <h1 className="text-3xl font-semibold">Panel de preparación</h1>
          </div>
          <p className="text-sm text-slate-600">Visualiza pedidos en orden cronológico y gestiona tiempos de preparación.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const minutes = elapsedMinutes(order.createdAt);
            const isAlert = minutes >= 20;
            return (
              <article key={order.id} className={`card overflow-hidden border-2 ${isAlert ? 'border-rose-400' : 'border-slate-200'}`}>
                <div className="bg-slate-950 px-5 py-4 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mesa {order.table?.label || 'Domicilio'}</p>
                      <p className="mt-2 text-lg font-semibold">Pedido #{order.id}</p>
                    </div>
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950">{order.status}</span>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <span>T. transcurrido</span>
                    <strong>{minutes} min</strong>
                  </div>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="rounded-3xl bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{item.menuItem.name}</p>
                        <p className="text-sm text-slate-600">x{item.quantity} {item.specialNote ? `· ${item.specialNote}` : ''}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {order.status === 'PENDING' && (
                      <button className="rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white" onClick={() => updateStatus(order.id, 'PREPARING')}>Iniciar</button>
                    )}
                    {order.status !== 'READY' && (
                      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => updateStatus(order.id, 'READY')}>Listo</button>
                    )}
                  </div>
                  {isAlert && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Alerta: tiempo elevado. Priorizar este pedido.</p>}
                </div>
              </article>
            );
          })}
        </div>
      </main>
  );
}
