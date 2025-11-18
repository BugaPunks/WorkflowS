"use client";

import { FC, useState } from "react";
import { Project, Sprint } from "@/types";
import SprintForm from "./SprintForm";

const SprintsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  const handleCreateSprint = async (sprintData: Partial<Sprint>) => {
    try {
      const res = await fetch(`/api/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sprintData, projectId: project.id }),
      });
      if (res.ok) {
        setShowCreateForm(false);
        onUpdate();
      }
    } catch (error) {
    }
  };

  const handleUpdateSprint = async (sprintData: Partial<Sprint>) => {
    if (!editingSprint) return;
    try {
      const res = await fetch(`/api/sprints/${editingSprint.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sprintData),
      });
      if (res.ok) {
        setEditingSprint(null);
        onUpdate();
      }
    } catch (error) {
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este sprint?')) return;
    try {
      const res = await fetch(`/api/sprints/${sprintId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Sprints</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Crear Sprint
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <SprintForm
            projectId={project.id}
            onSubmit={handleCreateSprint}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {editingSprint && (
        <div className="mb-6">
          <SprintForm
            sprint={editingSprint}
            projectId={project.id}
            onSubmit={handleUpdateSprint}
            onCancel={() => setEditingSprint(null)}
          />
        </div>
      )}

      <div className="space-y-4">
        {project.sprints.map(sprint => (
          <div key={sprint.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{sprint.name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {sprint.stories.length} historias de usuario
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSprint(sprint)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteSprint(sprint.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintsTab;