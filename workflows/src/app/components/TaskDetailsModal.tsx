"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Task, Comment } from '@/types';

const TaskDetailsModal = ({ task, onClose, onUpdate }: { task: Task; onClose: () => void; onUpdate: () => void; }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  // ... (comments logic remains the same)

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      onClose(); // Close the modal
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        {!isEditing ? (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{task.title}</h2>
              <div>
                <button onClick={() => setIsEditing(true)} className="text-sm bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={handleDelete} className="text-sm bg-red-600 text-white px-2 py-1 rounded ml-2">Delete</button>
                <button onClick={onClose} className="text-2xl font-bold ml-4">&times;</button>
              </div>
            </div>
            <p>{task.description}</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <input name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full text-2xl font-bold border rounded p-1" />
            <textarea name="description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-2 border rounded p-1" />
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        )}
        {/* ... (comments section remains the same) */}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
