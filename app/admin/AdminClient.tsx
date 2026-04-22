'use client';

import { useState } from 'react';

interface Report {
  title: string;
  value: string;
  delta: string;
}

interface StaffMember {
  name: string;
  role: string;
  status: string;
}

interface AdminClientProps {
  reports: Report[];
  staff: StaffMember[];
}

export default function AdminClient({ reports, staff: initialStaff }: AdminClientProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    status: 'En turno'
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setStaff([...staff, newMember]);
      setNewMember({ name: '', role: '', status: 'En turno' });
      setShowAddForm(false);
    }
  };

  return (
    <main className="flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Administración</p>
            <h1 className="text-3xl font-semibold">Contabilidad y reportes</h1>
          </div>
          <p className="text-sm text-slate-600">Registro de ventas diarias, ingresos, egresos y métricas clave.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {reports.map((card) => (
            <div key={card.title} className="card p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm text-slate-600">{card.delta}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Impulso de ingresos</h2>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm uppercase tracking-[0.2em] text-slate-600">Semanal</div>
            </div>
            <div className="mt-8 grid grid-cols-7 gap-3 text-center text-sm text-slate-600">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="space-y-2">
                  <div className="mx-auto h-24 w-10 rounded-3xl bg-slate-200"></div>
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold">Libro financiero</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Ingresos totales</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">$0</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Gastos operativos</p>
                <p className="mt-2 text-2xl font-semibold text-rose-600">$0</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-slate-500">Margen neto</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">0%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gestión de personal</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              {showAddForm ? 'Cancelar' : 'Agregar miembro'}
            </button>
          </div>

          {showAddForm && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Rol"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                />
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                >
                  <option value="En turno">En turno</option>
                  <option value="Desconectado">Desconectado</option>
                </select>
              </div>
              <button
                onClick={handleAddMember}
                className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Agregar
              </button>
            </div>
          )}

          <div className="mt-5 space-y-4">
            {staff.map((member, index) => (
              <div key={`${member.name}-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
                <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white">{member.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
  );
}