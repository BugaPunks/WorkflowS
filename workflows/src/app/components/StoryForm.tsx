"use client";

import { useState, FormEvent } from 'react';
import { UserStory } from '@/types';

interface StoryFormProps {
  story?: UserStory;
  projectId: string;
  onSubmit: (storyData: Partial<UserStory>) => void;
  onCancel: () => void;
}

export default function StoryForm({ story, projectId, onSubmit, onCancel }: StoryFormProps) {
  const [formData, setFormData] = useState({
    title: story?.title || '',
    description: story?.description || '',
    priority: story?.priority || 1,
    acceptanceCriteria: story?.acceptanceCriteria || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title) {
      setError('El título es requerido.');
      return;
    }

    try {
      onSubmit(formData);
    } catch (err) {
      setError('Error al guardar historia.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-4">
        {story ? 'Editar Historia de Usuario' : 'Crear Historia de Usuario'}
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Prioridad</label>
        <input
          type="number"
          min="1"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Criterios de Aceptación</label>
        <textarea
          value={formData.acceptanceCriteria}
          onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {story ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}