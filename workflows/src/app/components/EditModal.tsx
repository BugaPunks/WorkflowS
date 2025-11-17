"use client";

import { useState, useEffect, FormEvent } from 'react';

interface EditModalProps {
  item: any; // Generic item to edit
  itemType: 'Sprint' | 'User Story';
  onClose: () => void;
  onSave: (updatedItem: any) => void;
}

const EditModal = ({ item, itemType, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit {itemType}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
          <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
          {itemType === 'User Story' && (
            <textarea name="acceptanceCriteria" value={formData.acceptanceCriteria || ''} onChange={handleChange} placeholder="Acceptance Criteria" className="w-full p-2 border rounded" />
          )}
          {/* Add fields for dates if it's a Sprint */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
