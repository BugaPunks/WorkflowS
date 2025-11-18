"use client";

import { FC, useState } from "react";
import { Project, UserStory, Task } from "@/types";
import StoryForm from "./StoryForm";
import CreateTaskForm from "./CreateTaskForm";

const BacklogTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [creatingTaskFor, setCreatingTaskFor] = useState<string | null>(null);

  const handleCreateStory = async (storyData: Partial<UserStory>) => {
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...storyData, projectId: project.id }),
      });
      if (res.ok) {
        setShowCreateStory(false);
        onUpdate();
      }
    } catch (error) {
    }
  };

  const handleUpdateStory = async (storyData: Partial<UserStory>) => {
    if (!editingStory) return;
    try {
      const res = await fetch(`/api/stories/${editingStory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData),
      });
      if (res.ok) {
        setEditingStory(null);
        onUpdate();
      }
    } catch (error) {
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta historia de usuario?')) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    if (!creatingTaskFor) return;
    try {
      const res = await fetch(`/api/stories/${creatingTaskFor}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        setCreatingTaskFor(null);
        onUpdate();
      }
    } catch (error) {
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Product Backlog</h3>
        <button
          onClick={() => setShowCreateStory(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Agregar Historia de Usuario
        </button>
      </div>

      {showCreateStory && (
        <div className="mb-6">
          <StoryForm
            projectId={project.id}
            onSubmit={handleCreateStory}
            onCancel={() => setShowCreateStory(false)}
          />
        </div>
      )}

      {editingStory && (
        <div className="mb-6">
          <StoryForm
            story={editingStory}
            projectId={project.id}
            onSubmit={handleUpdateStory}
            onCancel={() => setEditingStory(null)}
          />
        </div>
      )}

      {creatingTaskFor && (
        <div className="mb-6">
          <CreateTaskForm
            storyId={creatingTaskFor}
            onTaskCreated={() => {
              setCreatingTaskFor(null);
              onUpdate();
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {project.userStories
          ?.sort((a, b) => a.priority - b.priority)
          .map((story) => (
          <div key={story.id} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg">{story.title}</h4>
              <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                Prioridad: {story.priority}
              </span>
            </div>
            <p className="text-gray-600 my-2">{story.description}</p>
            {story.acceptanceCriteria && (
              <p className="text-sm text-gray-700">
                <strong>Criterios de Aceptación:</strong> {story.acceptanceCriteria}
              </p>
            )}

            <div className="mt-4">
              <h5 className="font-medium mb-2">Tareas ({story.tasks?.length || 0})</h5>
              {story.tasks && story.tasks.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                  {story.tasks.map(task => (
                    <li key={task.id}>
                      {task.title} - {task.status} {task.assignedTo && `(${task.assignedTo.name})`}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setCreatingTaskFor(story.id)}
                className="text-green-600 hover:underline mr-4 text-sm"
              >
                Agregar Tarea
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingStory(story)}
                className="text-blue-600 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteStory(story.id)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklogTab;