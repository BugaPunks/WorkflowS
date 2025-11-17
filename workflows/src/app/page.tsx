"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Project, Task } from "@/types";

// ... (StudentDashboard remains the same)

const TeacherDashboard: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const fetchProjects = () => fetch('/api/projects').then(res => res.json()).then(setProjects);

  useEffect(() => { fetchProjects(); }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project and all its data?")) {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      fetchProjects(); // Refresh list
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Supervised Projects</h2>
      {/* TODO: Add Edit Project Modal button here */}
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <Link href={`/projects/${project.id}`} className="flex-grow">
              <h3 className="text-xl font-semibold hover:underline">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
            </Link>
            <div className="flex-shrink-0">
              <button onClick={() => alert("Edit functionality to be implemented.")} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded mr-2">Edit</button>
              <button onClick={() => handleDeleteProject(project.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Home Page (Dispatcher) ---
export default function Home() {
  // ... (Main component logic remains the same)
  return <div>...</div> // Placeholder to keep it short
}
