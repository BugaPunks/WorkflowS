'use client';

import { useState, useEffect } from 'react';

interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  acceptanceCriteria: string;
  storyPoints?: number;
  sprint?: {
    id: string;
    name: string;
  };
}

interface ProjectMetrics {
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  pendingStories: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
}

export default function DashboardProductOwner({ projectId }: { projectId: string }) {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  const fetchDashboardData = async () => {
    try {
      const [storiesRes, metricsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/stories/backlog`),
        fetch(`/api/projects/${projectId}/stories/metrics`)
      ]);

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setStories(storiesData);
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

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-100';
    if (priority >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="p-6">Cargando dashboard de Product Owner...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">📋</span>
        </div>
        <h1 className="text-2xl font-bold">Dashboard Product Owner</h1>
      </div>

      {/* Project Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Historias</h3>
              <span className="text-gray-400">📚</span>
            </div>
            <div className="text-2xl font-bold">{metrics.totalStories}</div>
            <p className="text-xs text-gray-500">
              {metrics.totalStoryPoints} story points
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completadas</h3>
              <span className="text-green-400">✅</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{metrics.completedStories}</div>
            <p className="text-xs text-gray-500">
              {metrics.completedStoryPoints} story points
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">En Progreso</h3>
              <span className="text-blue-400">🔄</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{metrics.inProgressStories}</div>
            <p className="text-xs text-gray-500">
              {Math.round((metrics.inProgressStories / metrics.totalStories) * 100)}% del total
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
              <span className="text-gray-400">⏳</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">{metrics.pendingStories}</div>
            <p className="text-xs text-gray-500">
              {Math.round((metrics.pendingStories / metrics.totalStories) * 100)}% del total
            </p>
          </div>
        </div>
      )}

      {/* Backlog Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Gestión del Backlog</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{story.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{story.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(story.priority)}`}>
                      Prioridad {story.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(story.status)}`}>
                      {story.status === 'TODO' ? 'Pendiente' : 
                       story.status === 'IN_PROGRESS' ? 'En Progreso' : 'Completada'}
                    </span>
                  </div>
                </div>
                
                {story.acceptanceCriteria && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Criterios de Aceptación:</h4>
                    <p className="text-sm text-gray-600">{story.acceptanceCriteria}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-4">
                    {story.storyPoints && (
                      <span className="text-sm text-gray-500">
                        📊 {story.storyPoints} story points
                      </span>
                    )}
                    {story.sprint && (
                      <span className="text-sm text-blue-600">
                        🏃 Sprint: {story.sprint.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Editar
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                      Mover
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
                <span className="text-2xl mb-2 block">➕</span>
                <span className="text-sm font-medium">Nueva Historia</span>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📋</span>
                <span className="text-sm font-medium">Planificar Sprint</span>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl mb-2 block">📊</span>
                <span className="text-sm font-medium">Ver Reportes</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}