"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Project, Task } from "@/types"; // Make sure Task is correctly imported

// --- Student Dashboard Component (Rebuilt) ---
const StudentDashboard: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/users/me/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="p-6">Loading my tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="p-6 bg-white rounded-lg shadow-md"><p>You have no tasks assigned to you. Great job!</p></div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Assigned Tasks</h2>
      <div className="space-y-4">
        {tasks.map(task => {
          // Safe access to nested properties
          const projectInfo = task.userStory?.project;
          return (
            <Link href={projectInfo ? `/projects/${projectInfo.id}/board` : "#"} key={task.id} className="block p-4 border rounded shadow-sm hover:bg-gray-50">
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-500">
                Project: {projectInfo?.name || "N/A"} | Status: <span className="capitalize">{task.status.replace('_', ' ').toLowerCase()}</span>
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  );
};

// --- Teacher/Admin Dashboard (Unchanged) ---
const TeacherDashboard: FC = () => { /* ... */ return <div>Teacher Dashboard</div>; };

// --- Main Home Page (Dispatcher) ---
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  if (status === "loading" || !session) {
    return <div className="p-8">Loading...</div>;
  }

  const userRole = session.user.role;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {userRole === 'ESTUDIANTE' && <StudentDashboard />}
        {userRole === 'DOCENTE' && <TeacherDashboard />}
        {userRole === 'ADMIN' && <TeacherDashboard />}
      </div>
    </div>
  );
}
