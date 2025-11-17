"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Project, User, Task } from "@/types"; // Task might need its full type with relations
import { ScrumRole } from "@prisma/client";

// --- Student Dashboard Component ---
const StudentDashboard: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('/api/users/me/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Assigned Tasks</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <Link href={`/projects/${(task.userStory?.project as any)?.id}/board`} key={task.id} className="block p-4 border rounded shadow-sm hover:bg-gray-50">
            <p className="font-semibold">{task.title}</p>
            <p className="text-sm text-gray-500">Project: {(task.userStory?.project as any)?.name} | Status: <span className="capitalize">{task.status.replace('_', ' ').toLowerCase()}</span></p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Teacher/Admin Dashboard Component ---
const TeacherDashboard: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  // ... (existing logic for fetching projects, users, creating projects)

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Supervised Projects</h2>
      <div className="space-y-4">
        {projects.map(project => (
          <Link href={`/projects/${project.id}`} key={project.id} className="block p-4 border rounded shadow-sm hover:bg-gray-50">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
          </Link>
        ))}
      </div>
      {/* Form for creating new projects would also go here */}
    </div>
  );
};

// --- Main Home Page (Dispatcher) ---
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  const userRole = session.user.role;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">
            Sign Out
          </button>
        </div>
        {userRole === 'ESTUDIANTE' && <StudentDashboard />}
        {userRole === 'DOCENTE' && <TeacherDashboard />}
        {userRole === 'ADMIN' && <TeacherDashboard />}
      </div>
    </div>
  );
}
