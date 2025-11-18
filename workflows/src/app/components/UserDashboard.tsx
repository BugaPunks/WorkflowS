"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Task } from "@/types";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/users/me/tasks');
          if (res.ok) {
            const data = await res.json();
            setTasks(data);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserTasks();
  }, [session]);

  if (loading) return <div>Cargando...</div>;

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Tareas Pendientes</h3>
          <p className="text-2xl font-bold text-blue-600">{pendingTasks.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">En Progreso</h3>
          <p className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Completadas</h3>
          <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Mis Tareas Recientes</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    {task.userStory?.project?.name} - {task.status}
                  </p>
                </div>
                <Link
                  href={`/projects/${task.userStory?.project?.id}/board`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/projects"
              className="block w-full bg-blue-500 hover:bg-blue-700 text-white text-center py-2 px-4 rounded"
            >
              Ver Mis Proyectos
            </Link>
            <Link
              href="/projects"
              className="block w-full bg-green-500 hover:bg-green-700 text-white text-center py-2 px-4 rounded"
            >
              Unirme a un Proyecto
            </Link>
            <Link
              href="/projects"
              className="block w-full bg-purple-500 hover:bg-purple-700 text-white text-center py-2 px-4 rounded"
            >
              Crear Nuevo Proyecto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}