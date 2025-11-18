"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Project } from "@/types";
import Link from "next/link";

// Import the new tab components
import ProjectOverview from "@/app/components/ProjectOverview";
import SprintsTab from "@/app/components/SprintsTab";
import BacklogTab from "@/app/components/BacklogTab";
import EvaluationsTab from "@/app/components/EvaluationsTab";
import ReportsTab from "@/app/components/ReportsTab";
import DocumentsTab from "@/app/components/DocumentsTab";
import SettingsTab from "@/app/components/SettingsTab";
import ChatPanel from "@/app/components/ChatPanel";
import ExportPanel from "@/app/components/ExportPanel";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

const ProjectPage: FC<ProjectPageProps> = ({ params }) => {
  const { projectId } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProject = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await res.json();
      setProject(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!project) {
    return <div>Proyecto no encontrado</div>;
  }

  const renderTabContent = () => {
    if (!project) return null;
    switch (activeTab) {
      case "overview":
        return <ProjectOverview project={project} />;
      case "backlog":
        return <BacklogTab project={project} onUpdate={fetchProject} />;
      case "sprints":
        return <SprintsTab project={project} onUpdate={fetchProject} />;
      case "evaluations":
        return <EvaluationsTab project={project} onUpdate={fetchProject} />;
      case "reports":
        return <ReportsTab project={project} />;
      case "documents":
        return <DocumentsTab project={project} onUpdate={fetchProject} />;
      case "chat":
        return <ChatPanel />;
      case "export":
        return <ExportPanel />;
      case "settings":
        return <SettingsTab project={project} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Link href={`/projects/${project.id}/board`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver Tablero
        </Link>
      </div>
      <p className="mb-6">{project.description}</p>

      <div className="flex border-b mb-4">
        <button onClick={() => setActiveTab("overview")} className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}>Resumen</button>
        <button onClick={() => setActiveTab("backlog")} className={`py-2 px-4 ${activeTab === 'backlog' ? 'border-b-2 border-blue-500' : ''}`}>Backlog</button>
        <button onClick={() => setActiveTab("sprints")} className={`py-2 px-4 ${activeTab === 'sprints' ? 'border-b-2 border-blue-500' : ''}`}>Sprints</button>
        <button onClick={() => setActiveTab("evaluations")} className={`py-2 px-4 ${activeTab === 'evaluations' ? 'border-b-2 border-blue-500' : ''}`}>Evaluaciones</button>
        <button onClick={() => setActiveTab("reports")} className={`py-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-500' : ''}`}>Reportes</button>
        <button onClick={() => setActiveTab("documents")} className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-500' : ''}`}>Documentos</button>
        <button onClick={() => setActiveTab("chat")} className={`py-2 px-4 ${activeTab === 'chat' ? 'border-b-2 border-blue-500' : ''}`}>💬 Chat</button>
        <button onClick={() => setActiveTab("export")} className={`py-2 px-4 ${activeTab === 'export' ? 'border-b-2 border-blue-500' : ''}`}>📤 Exportar</button>
        <button onClick={() => setActiveTab("settings")} className={`py-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-blue-500' : ''}`}>Configuración</button>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectPage;
