// This is a conceptual change. I'll add a Task creation form inside the Sprints/Backlog tab.
// Re-writing the whole file is inefficient. I'll describe the change and then
// add a new file for a dedicated Task component to keep it clean.

// First, create a component for creating tasks.
// File: src/app/components/CreateTaskForm.tsx
import { FormEvent, useState } from "react";

const CreateTaskForm = ({ storyId, onTaskCreated }: { storyId: string, onTaskCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [storyPoints, setStoryPoints] = useState(1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`/api/stories/${storyId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, storyPoints: parseInt(storyPoints.toString(), 10) })
    });
    onTaskCreated();
    setTitle("");
    setStoryPoints(1);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title..." required className="flex-grow p-1 border rounded" />
      <input type="number" value={storyPoints} onChange={e => setStoryPoints(parseInt(e.target.value, 10))} min="1" className="w-16 p-1 border rounded" />
      <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded">+</button>
    </form>
  );
};

export default CreateTaskForm;
