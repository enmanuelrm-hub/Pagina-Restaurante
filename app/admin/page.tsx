import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

const reports = [
  { title: 'Ingresos brutos', value: '$0', delta: 'Sin operaciones' },
  { title: 'Pedidos activos', value: '0', delta: 'Sin actividad' },
  { title: 'Rotación promedio', value: '0m', delta: 'Sin datos' },
  { title: 'Personal turno', value: '3 / 3', delta: 'Todos registrados' },
];

const staff = [
  { name: 'Marcus Vane', role: 'Chef de cocina', status: 'En turno' },
  { name: 'Elena Thorne', role: 'Jefa de meseros', status: 'En turno' },
  { name: 'David Chen', role: 'Conductor de flota', status: 'Desconectado' },
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <AdminClient reports={reports} staff={staff} />;
}
