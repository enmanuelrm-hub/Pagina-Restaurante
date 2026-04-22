'use client';

import { useEffect, useState } from 'react';

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/delivery')
      .then((res) => res.json())
      .then(setDeliveries);
  }, []);

  async function updateStatus(deliveryId: number, status: string) {
    const response = await fetch('/api/delivery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryId, status }),
    });
    const updated = await response.json();
    setDeliveries((current) => current.map((delivery) => (delivery.id === updated.id ? updated : delivery)));
  }

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Domicilios</p>
            <h1 className="text-3xl font-semibold">Panel de entregas</h1>
          </div>
          <p className="text-sm text-slate-600">Permite a domiciliarios ver pedidos, direcciones y estado del reparto.</p>
        </div>

        <div className="grid gap-6">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pedido #{delivery.order?.id}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{delivery.order?.orderItems[0]?.menuItem.name || 'Entrega'}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-700">{delivery.status}</span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dirección</p>
                  <p className="mt-3 text-slate-900">{delivery.address}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Repartidor</p>
                  <p className="mt-3 text-slate-900">{delivery.courier?.name || 'No asignado'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {['ASSIGNED', 'PICKED_UP', 'DELIVERED'].map((status) => (
                  <button key={status} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm transition hover:border-slate-900" onClick={() => updateStatus(delivery.id, status)}>{status.replace('_', ' ')}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
  );
}
