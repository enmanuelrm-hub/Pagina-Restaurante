'use client';

import { useEffect, useState } from 'react';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  async function updateQuantity(id: number, quantity: number) {
    const response = await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryId: id, quantity }),
    });
    const updated = await response.json();
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Inventario</p>
            <h1 className="text-3xl font-semibold">Gestión de insumos</h1>
          </div>
          <p className="text-sm text-slate-600">Controla stock, alertas de bajo inventario y reposición automática.</p>
        </div>

        <div className="grid gap-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Artículos totales</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{items.length}</p>
              </div>
              <div className="rounded-3xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{items.filter((item) => item.quantity <= item.lowStockThreshold).length} alertas de stock bajo</div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>Ingrediente / Producto</span>
              <span>Stock actual</span>
              <span>Unidad</span>
              <span>Proveedor</span>
              <span>Acción</span>
            </div>
            <div className="divide-y divide-slate-200 px-6 py-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {item.menuItem && <p className="text-sm text-slate-500">Plato asociado: {item.menuItem.name}</p>}
                  </div>
                  <div className={item.quantity <= item.lowStockThreshold ? 'text-rose-600 font-semibold' : ''}>{item.quantity}</div>
                  <div>{item.unit}</div>
                  <div className="text-sm text-slate-500">Proveedor genérico</div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" onClick={() => updateQuantity(item.id, item.quantity + 5)}>Reponer +5</button>
                    <button className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-1</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
  );
}
