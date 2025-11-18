"use client";

import { useState, FormEvent } from 'react';
import { Sprint } from '@/types';

interface SprintFormProps {
  sprint?: Sprint;
  projectId: string;
  onSubmit: (sprintData: Partial<Sprint>) => void;
  onCancel: () => void;
}

export default function SprintForm({ sprint, projectId, onSubmit, onCancel }: SprintFormProps) {
  const [formData, setFormData] = useState({
    name: sprint?.name || '',
    startDate: sprint?.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '',
    endDate: sprint?.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    try {
      onSubmit({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
    } catch (err) {
      setError('Error al guardar sprint.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-4">
        {sprint ? 'Editar Sprint' : 'Crear Sprint'}
      </h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha de Fin</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {sprint ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}