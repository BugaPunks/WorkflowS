"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, Task } from "@/types";
import { TaskStatus } from "@prisma/client";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskDetailsModal from "@/app/components/TaskDetailsModal"; // Import the modal

// --- Column Component ---
const Column = ({ id, title, tasks, onTaskClick }: { id: TaskStatus, title: string, tasks: Task[], onTaskClick: (task: Task) => void }) => (
  <div className="p-4 bg-gray-200 rounded-lg">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
      <div className="space-y-4">
        {tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
      </div>
    </SortableContext>
  </div>
);

// --- Task Card Component ---
const TaskCard = ({ task, onClick }: { task: Task, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="p-4 bg-white rounded-md shadow touch-none cursor-pointer">
      <p className="font-semibold">{task.title}</p>
    </div>
  );
};

// --- Main Board Page ---
export default function BoardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [activeSprintId, setActiveSprintId] = useState<string | "backlog">("backlog");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchProject = async () => { /* ... (fetch logic remains the same) */ };
  useEffect(() => { fetchProject(); }, [projectId]);
  useEffect(() => { /* ... (task filtering logic remains the same) */ }, [project, activeSprintId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => { /* ... (drag logic remains the same) */ };

  if (!project) return <div>Loading...</div>;

  const columns: { id: TaskStatus; title: string }[] = [ { id: "PENDING", title: "To Do" }, { id: "IN_PROGRESS", title: "In Progress" }, { id: "COMPLETED", title: "Completed" } ];

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                onTaskClick={setSelectedTask}
              />
            ))}
          </main>
        </div>
      </DndContext>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onCommentAdded={fetchProject} // Refetch all data when a comment is added
        />
      )}
    </>
  );
}
