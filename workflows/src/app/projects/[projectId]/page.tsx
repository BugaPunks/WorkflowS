"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Project } from "@/types";
import BurndownChart from "@/app/components/BurndownChart";

// --- Main Project Page ---
export default function ProjectPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState("sprints");
  const [project, setProject] = useState<Project | null>(null);

  const fetchProject = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        console.error("Failed to fetch project");
      }
    } catch (error) {
      console.error("Failed to fetch project", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProject();
    }
  }, [status, session, projectId]);

  if (!project) return <div>Loading...</div>;

  const SprintsTab = () => <div>Sprints & Backlog Content</div>;
  const EvaluationsTab = () => <div>Evaluations Content</div>;
  const ReportsTab = () => <BurndownChart sprintId={project.sprints[0]?.id || null} />;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="mb-8"><Link href="/" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</Link><h1 className="text-4xl font-bold text-gray-900 mt-2">{project.name}</h1></header>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('sprints')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sprints' ? 'border-indigo-500' : 'border-transparent'}`}>Sprints & Backlog</button>
          <Link href={`/projects/${projectId}/board`} className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500">Kanban Board</Link>
          <button onClick={() => setActiveTab('evaluations')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'evaluations' ? 'border-indigo-500' : 'border-transparent'}`}>Evaluations</button>
          <button onClick={() => setActiveTab('reports')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-indigo-500' : 'border-transparent'}`}>Reports</button>
        </nav>
      </div>
      <div>
        {activeTab === 'sprints' && <SprintsTab />}
        {activeTab === 'evaluations' && <EvaluationsTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
