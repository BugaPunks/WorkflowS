'use client';

import { useState, useEffect } from 'react';

interface SprintMetrics {
  id: string;
  name: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  endDate: string;
}

interface TeamMember {
  id: string;
  name: string;
  tasksCompleted: number;
  tasksPending: number;
  role: string;
}

interface Blocker {
  id: string;
  description: string;
  taskId: string;
  reportedBy: string;
  createdAt: string;
}

export default function DashboardScrumMaster({ projectId }: { projectId: string }) {
  const [sprints, setSprints] = useState<SprintMetrics[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  const fetchDashboardData = async () => {
    try {
      const [sprintsRes, teamRes, blockersRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/sprints/metrics`),
        fetch(`/api/projects/${projectId}/team/metrics`),
        fetch(`/api/projects/${projectId}/blockers`)
      ]);

      if (sprintsRes.ok) {
        const sprintsData = await sprintsRes.json();
        setSprints(sprintsData);
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMembers(teamData);
      }

      if (blockersRes.ok) {
        const blockersData = await blockersRes.json();
        setBlockers(blockersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando dashboard de Scrum Master...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">📊</span>
        </div>
        <h1 className="text-2xl font-bold">Dashboard Scrum Master</h1>
      </div>

      {/* Sprint Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Sprints Activos</h3>
            <span className="text-gray-400">🎯</span>
          </div>
          <div className="text-2xl font-bold">{sprints.length}</div>
          <p className="text-xs text-gray-500">
            {sprints.filter(s => s.progress < 100).length} en progreso
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Velocidad del Equipo</h3>
            <span className="text-gray-400">📈</span>
          </div>
          <div className="text-2xl font-bold">
            {teamMembers.length > 0 
              ? Math.round(teamMembers.reduce((acc, member) => acc + member.tasksCompleted, 0) / teamMembers.length)
              : 0}
          </div>
          <p className="text-xs text-gray-500">Tareas por persona</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Bloqueos Activos</h3>
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{blockers.length}</div>
          <p className="text-xs text-gray-500">Requieren atención</p>
        </div>
      </div>

      {/* Current Sprints */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Progreso de Sprints</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sprints.map((sprint) => (
              <div key={sprint.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{sprint.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    sprint.progress === 100 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.tasksCompleted}/{sprint.totalTasks} tareas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${sprint.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  Finaliza: {new Date(sprint.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>👥</span>
              Rendimiento del Equipo
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {member.role}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {member.tasksCompleted} completadas
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.tasksPending} pendientes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blockers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              Bloqueos del Equipo
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {blockers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay bloqueos activos
                </p>
              ) : (
                blockers.map((blocker) => (
                  <div key={blocker.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm font-medium">{blocker.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reportado por {blocker.reportedBy} • {new Date(blocker.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}