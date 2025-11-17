"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Project, Sprint, Task, UserStory } from "@/types";
import { TaskStatus } from "@prisma/client";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "PENDING", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Completed" },
];

// Column Component
function Column({ id, title, tasks }: { id: TaskStatus, title: string, tasks: Task[] }) {
  const { setNodeRef } = useSortable({ id });
  return (
    <div ref={setNodeRef} className="p-4 bg-gray-200 rounded-lg">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
        <div className="space-y-4">
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      </SortableContext>
    </div>
  );
}

// Task Card Component
function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 bg-white rounded-md shadow touch-none">
      <p className="font-semibold">{task.title}</p>
    </div>
  );
}

export default function BoardPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeSprintId, setActiveSprintId] = useState<string | "backlog">("backlog");
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchProject = async () => {
    if (session) {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        if (data.sprints?.length > 0 && activeSprintId === "backlog") {
          setActiveSprintId(data.sprints[0].id);
        }
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchProject();
  }, [status, session, projectId]);

  useEffect(() => {
    if (!project) return;
    let currentTasks: Task[] = [];
    const targetStories = (activeSprintId === "backlog")
      ? project.stories.filter(s => !s.sprintId)
      : project.sprints.find(s => s.id === activeSprintId)?.stories || [];

    targetStories.forEach(story => {
      if (story.tasks) currentTasks.push(...story.tasks);
    });
    setTasks(currentTasks);
  }, [project, activeSprintId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeTask = tasks.find(t => t.id === activeId);

    if (!activeTask || activeId === overId) return;

    // The `over.id` will be the ID of the droppable column if dropped in a new column.
    const newStatus = Object.values(TaskStatus).find(s => s === overId);

    if (newStatus && activeTask.status !== newStatus) {
      // Update task status
      setTasks(prevTasks => prevTasks.map(t => t.id === activeId ? { ...t, status: newStatus } : t));
      await fetch(`/api/tasks/${activeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } else {
      // Reorder tasks within the same column
      const oldIndex = tasks.findIndex(t => t.id === activeId);
      const newIndex = tasks.findIndex(t => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    }
  };

  if (status === "loading" || !project) return <div>Loading...</div>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-8 bg-gray-100 min-h-screen">
        <header className="mb-8">
          <Link href={`/projects/${projectId}`} className="text-indigo-600 hover:underline">&larr; Back to Project</Link>
          <h1 className="text-4xl font-bold mt-2">{project.name} - Kanban Board</h1>
          <select value={activeSprintId} onChange={e => setActiveSprintId(e.target.value)} className="mt-4 p-2 border rounded">
            <option value="backlog">Backlog</option>
            {project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </header>

        <main className="grid grid-cols-3 gap-6">
          {columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(t => t.status === column.id)}
            />
          ))}
        </main>
      </div>
    </DndContext>
  );
}
