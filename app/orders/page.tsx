'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

const sampleMenu = [
  { id: 1, name: 'Ribeye a la Pimienta', price: 42.0 },
  { id: 2, name: 'Risotto de Hongos', price: 28.0 },
  { id: 3, name: 'Tagliatelle a la Trufa', price: 29.0 },
  { id: 4, name: 'Salmón del Atlántico', price: 34.0 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [items, setItems] = useState([{ menuItemId: 1, quantity: 1, specialNote: '' }]);
  const [type, setType] = useState('DINE_IN');
  const [tableId, setTableId] = useState(1);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const menuItem = sampleMenu.find((menu) => menu.id === item.menuItemId);
        return sum + (menuItem?.price || 0) * (item.quantity || 1);
      }, 0),
    [items]
  );

  const { data: session } = useSession();

  async function handleCreateOrder() {
    if (!session?.user?.id) {
      setStatus('Error: usuario no autenticado para crear el pedido.');
      return;
    }

    setStatus('Guardando pedido...');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        tableId: Number(tableId),
        waiterId: session.user.id,
        note,
        items,
        deliveryAddress: 'Calle Falsa 123',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      setStatus(`Error creando pedido: ${errorText || response.statusText}`);
      return;
    }

    const data = await response.json();
    setOrders((current) => [data, ...current]);
    setStatus('Pedido creado con éxito');
  }

  function updateItem(index: number, key: string, value: any) {
    setItems((current) => current.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    setItems((current) => [...current, { menuItemId: 1, quantity: 1, specialNote: '' }]);
  }

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pedidos</p>
            <h1 className="text-3xl font-semibold">Gestión de pedidos</h1>
          </div>
          <p className="text-sm text-slate-600">Optimiza la operación entre meseros, cocina y delivery.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <section className="card p-6">
            <h2 className="text-xl font-semibold">Crear nuevo pedido</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span>Tipo de pedido</span>
                  <select className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="DINE_IN">Local</option>
                    <option value="TAKEAWAY">Para llevar</option>
                    <option value="DELIVERY">Domicilio</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span>Mesa</span>
                  <select className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={tableId} onChange={(e) => setTableId(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map((table) => (
                      <option key={table} value={table}>Mesa {table}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
                      <label className="space-y-2">
                        <span>Plato</span>
                        <select className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={item.menuItemId} onChange={(e) => updateItem(index, 'menuItemId', Number(e.target.value))}>
                          {sampleMenu.map((menu) => (
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2">
                        <span>Cantidad</span>
                        <input type="number" min={1} className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
                      </label>
                    </div>
                    <label className="mt-4 block space-y-2">
                      <span>Notas especiales</span>
                      <input type="text" className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={item.specialNote} onChange={(e) => updateItem(index, 'specialNote', e.target.value)} placeholder="Ej. sin cebolla" />
                    </label>
                  </div>
                ))}
              </div>
              <button type="button" className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800" onClick={addItem}>Agregar línea</button>
              <label className="space-y-2">
                <span>Instrucciones adicionales</span>
                <textarea className="w-full rounded-3xl border border-slate-300 px-4 py-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. alergia, punto, cortesía"></textarea>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total estimado</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">${totalPrice.toFixed(2)}</p>
              </div>
              <button type="button" className="rounded-3xl bg-brand-700 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600" onClick={handleCreateOrder}>Enviar pedido</button>
            </div>
            {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
          </section>

          <section className="space-y-4">
            <div className="card p-6">
              <h2 className="text-xl font-semibold">Pedidos recientes</h2>
              <div className="mt-5 space-y-4">
                {orders.slice(0, 6).map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-900">Pedido #{order.id}</span>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white">{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Tipo: {order.type.replace('_', ' ')}</p>
                    <p className="mt-1 text-sm text-slate-600">Total: ${order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold">Indicadores</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pedidos en cocina</p>
                  <p className="mt-3 text-3xl font-semibold">{orders.filter((order) => order.status === 'PENDING').length}</p>
                </div>
                <div className="rounded-3xl bg-amber-100 p-5 text-slate-900">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pedidos con nota</p>
                  <p className="mt-3 text-3xl font-semibold">{orders.filter((order) => order.note).length}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
  );
}
