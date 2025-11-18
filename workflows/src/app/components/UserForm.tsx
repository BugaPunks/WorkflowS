"use client";

import { useState, FormEvent } from 'react';
import { User, RoleName } from '@/types';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'ESTUDIANTE' as RoleName,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Nombre y email son requeridos.');
      return;
    }

    if (!user && !formData.password) {
      setError('Contraseña es requerida para nuevos usuarios.');
      return;
    }

    try {
      onSubmit(formData);
    } catch (err) {
      setError('Error al guardar usuario.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-4">
        {user ? 'Editar Usuario' : 'Crear Usuario'}
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
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {!user && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rol</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleName })}
          className="w-full p-2 border rounded"
        >
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="DOCENTE">Docente</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {user ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}