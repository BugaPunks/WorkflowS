'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  storyPoints?: number;
  userStory: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DeveloperMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
  currentSprintTasks: number;
}

export default function DashboardTeamDeveloper({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<DeveloperMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, metricsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/tasks/my-tasks`),
        fetch(`/api/projects/${projectId}/tasks/my-metrics`)
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'IN_PROGRESS': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Completada';
      case 'IN_PROGRESS': return 'En Progreso';
      default: return 'Pendiente';
    }
  };

  if (loading) {
    return <div className="p-6">Cargando dashboard de Team Developer...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">💻</span>
        </div>
        <h1 className="text-2xl font-bold">Dashboard Team Developer</h1>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Mis Tareas</h3>
              <span className="text-gray-400">📋</span>
            </div>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-gray-500">
              {metrics.currentSprintTasks} en sprint actual
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completadas</h3>
              <span className="text-green-400">✅</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}</div>
            <p className="text-xs text-gray-500">
              {metrics.completionRate}% de tasa de completado
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">En Progreso</h3>
              <span className="text-blue-400">🔄</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{metrics.inProgressTasks}</div>
            <p className="text-xs text-gray-500">
              {metrics.pendingTasks} pendientes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Rendimiento</h3>
              <span className="text-purple-400">📈</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{metrics.completionRate}%</div>
            <p className="text-xs text-gray-500">Tasa de completado</p>
          </div>
        </div>
      )}

      {/* My Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Mis Tareas Asignadas</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      📖 Historia: {task.userStory.title}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)} {getStatusText(task.status)}
                    </span>
                    {task.storyPoints && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        📊 {task.storyPoints} pts
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">
                    <span>Creada: {new Date(task.createdAt).toLocaleDateString()}</span>
                    {task.updatedAt !== task.createdAt && (
                      <span className="ml-4">
                        Actualizada: {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {task.status === 'PENDING' && (
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Iniciar
                      </button>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        Completar
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🔄</span>
                <span className="text-sm font-medium">Actualizar Progreso</span>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">💬</span>
                <span className="text-sm font-medium">Agregar Comentario</span>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <span className="text-sm font-medium">Mi Reporte</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}