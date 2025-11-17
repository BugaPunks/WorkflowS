"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, FC } from "react";
import Link from "next/link";
import { Project } from "@/types";
// ... (Import other tab components)

// --- Main Project Page ---
export default function ProjectPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState("sprints");
  const [project, setProject] = useState<Project | null>(null);

  const fetchProject = async () => {
    // ... (fetch logic)
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProject();
    }
  }, [status, session, projectId]);

  if (!project) return <div>Loading...</div>;

  // Placeholder components for tabs
  const SprintsTab = () => <div>Sprints content</div>;
  const EvaluationsTab = () => <div>Evaluations content</div>;
  const ReportsTab = () => <div>Reports content</div>;
  const DocumentsTab = () => <div>Documents content</div>;
  const CalendarTab = () => <div>Calendar content</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <Link href="/" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{project.name}</h1>
        </div>
        <a
          href={`/api/projects/${projectId}/export`}
          download // This attribute is helpful, but Content-Disposition handles it
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700"
        >
          Export Project Data
        </a>
      </header>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {/* ... Navigation buttons ... */}
        </nav>
      </div>

      <div>
        {/* ... Tab content ... */}
      </div>
    </div>
  );
}
