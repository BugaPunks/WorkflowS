"use client";

import { useEffect, useState } from 'react';
import { Project, Task, User } from '@/types';
import Link from 'next/link';
import RoleBasedDashboard from './RoleBasedDashboard';

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [activeMembers, setActiveMembers] = useState<User[]>([]);

  useEffect(() => {
    // Obtener tareas recientes y miembros activos
    const fetchOverviewData = async () => {
      try {
        // Obtener tareas recientes de todas las historias
        const allTasks: Task[] = [];
        project.userStories?.forEach(story => {
          if (story.tasks) {
            allTasks.push(...story.tasks);
          }
        });

        // Ordenar por id (asumiendo que id más alto = más reciente) y tomar las 5 más recientes
        const recent = allTasks
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))
          .slice(0, 5);
        setRecentTasks(recent);

        // Get active members (those with assigned tasks)
        const activeUserIds = new Set(allTasks.map(t => t.assignedTo?.id).filter(Boolean));
        const active = project.users
          .filter(u => activeUserIds.has(u.userId))
          .map(pu => pu.user);
        setActiveMembers(active);
      } catch (error) {
      }
    };

    fetchOverviewData();
  }, [project]);

  const totalTasks = project.userStories?.reduce((sum, story) => sum + (story.tasks?.length || 0), 0) || 0;
  const completedTasks = project.userStories?.reduce((sum, story) =>
    sum + (story.tasks?.filter(t => t.status === 'COMPLETED').length || 0), 0) || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeSprint = project.sprints?.find(s =>
    new Date(s.startDate) <= new Date() && new Date(s.endDate) >= new Date()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.id}/board`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Ver Tablero
          </Link>
          <Link
            href={`/projects/${project.id}/settings`}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Configuración
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Progreso General</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
            <div className="text-sm text-gray-600">{completedTasks}/{totalTasks} tareas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Miembros Activos</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
            <div className="text-sm text-gray-600">de {project.users.length} total</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Sprint Actual</h3>
          <div className="mt-2">
            <div className="text-lg font-semibold text-purple-600">
              {activeSprint?.name || 'Ninguno'}
            </div>
            <div className="text-sm text-gray-600">
              {activeSprint ? `${new Date(activeSprint.startDate).toLocaleDateString()} - ${new Date(activeSprint.endDate).toLocaleDateString()}` : 'Sin sprint activo'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Historias</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-orange-600">{project.userStories?.length || 0}</div>
            <div className="text-sm text-gray-600">en backlog</div>
          </div>
        </div>
      </div>

      {/* Timeline and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Timeline */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Línea de Tiempo de Sprints</h2>
          <div className="space-y-3">
            {project.sprints?.slice().reverse().map((sprint, index) => (
              <div key={sprint.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <div className="font-medium">{sprint.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  new Date(sprint.endDate) < new Date() ? 'bg-green-100 text-green-800' :
                  new Date(sprint.startDate) <= new Date() && new Date(sprint.endDate) >= new Date() ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {new Date(sprint.endDate) < new Date() ? 'Completado' :
                   new Date(sprint.startDate) <= new Date() && new Date(sprint.endDate) >= new Date() ? 'Activo' :
                   'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-gray-600">
                    {task.userStory?.project?.name} • {task.assignedTo?.name || 'Sin asignar'}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status === 'COMPLETED' ? 'Completada' :
                   task.status === 'IN_PROGRESS' ? 'En Progreso' :
                   'Pendiente'}
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No hay tareas recientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Equipo del Proyecto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.users.map(projectUser => (
            <div key={projectUser.id} className="flex items-center space-x-3 p-3 border rounded">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {projectUser.user.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <div className="font-medium">{projectUser.user.name}</div>
                <div className="text-sm text-gray-600">{projectUser.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Based Dashboard */}
      <div className="mt-8">
        <RoleBasedDashboard />
      </div>
    </div>
  );
}