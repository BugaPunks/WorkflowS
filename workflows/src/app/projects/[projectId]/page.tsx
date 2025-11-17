"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, FC, FormEvent } from "react";
import Link from "next/link";
import { Project, Document, Evaluation, Sprint, UserStory } from "@/types";
import BurndownChart from "@/app/components/BurndownChart";
import CreateTaskForm from "@/app/components/CreateTaskForm";

// --- Tab Components (Full Implementations) ---

const SprintsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const handleAssignSprint = async (storyId: string, sprintId: string | null) => {
    await fetch(`/api/stories/${storyId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sprintId }) });
    onUpdate();
  };
  const unassignedStories = project.stories.filter(story => !story.sprintId);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 p-4 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold mb-4">Backlog</h3>{unassignedStories.map(story => (<div key={story.id} className="p-2 border rounded mb-2"><p>{story.title}</p><select onChange={e => handleAssignSprint(story.id, e.target.value || null)} className="w-full mt-1 p-1 border rounded text-sm"><option value="">Assign to...</option>{project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>))}</div>
      <div className="lg:col-span-2 p-4 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold mb-4">Sprints</h3>{project.sprints.map(sprint => (<div key={sprint.id} className="p-3 mb-4 bg-gray-50 rounded"><h4 className="font-bold">{sprint.name}</h4>{sprint.stories.map(story => (<div key={story.id} className="p-2 border bg-white rounded mt-2"><p className="font-semibold">{story.title}</p><CreateTaskForm storyId={story.id} onTaskCreated={onUpdate} /></div>))}</div>))}</div>
    </div>
  );
};

const EvaluationsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const { data: session } = useSession();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const fetchEvaluations = async () => { const res = await fetch(`/api/projects/${project.id}/evaluations`); if (res.ok) setEvaluations(await res.json()); };
  useEffect(() => { fetchEvaluations(); }, [project.id]);
  const handleCreateEvaluation = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const data = { sprintId: fd.get("sprintId"), studentId: fd.get("studentId"), score: parseFloat(fd.get("score") as string), feedback: fd.get("feedback") }; await fetch(`/api/projects/${project.id}/evaluations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); fetchEvaluations(); e.currentTarget.reset(); };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {session?.user.role === "DOCENTE" && (<div className="md:col-span-1"><form onSubmit={handleCreateEvaluation} className="p-4 bg-white rounded-lg shadow-md space-y-4"><h3 className="text-xl font-semibold">New Evaluation</h3><select name="sprintId" required className="w-full p-2 border rounded"><option value="">Select Sprint</option>{project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select name="studentId" required className="w-full p-2 border rounded"><option value="">Select Student</option>{project.users.map(u => u.user.role !== 'DOCENTE' && <option key={u.user.id} value={u.user.id}>{u.user.name}</option>)}</select><input type="number" name="score" step="0.1" placeholder="Score (0-10)" required className="w-full p-2 border rounded" /><textarea name="feedback" placeholder="Feedback..." className="w-full p-2 border rounded" /><button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded">Submit</button></form></div>)}
      <div className={session?.user.role === "DOCENTE" ? "md:col-span-2" : "md:col-span-3"}><div className="p-4 bg-white rounded-lg shadow-md space-y-4"><h3 className="text-xl font-semibold">Submitted Evaluations</h3>{evaluations.map(ev => (<div key={ev.id} className="p-4 border rounded-md"><div className="flex justify-between"><p className="font-bold">{ev.student.name} - {ev.sprint.name}</p><p className="text-lg font-bold text-indigo-600">{ev.score.toFixed(1)}</p></div><p className="mt-2">{ev.feedback}</p></div>))}</div></div>
    </div>
  );
};

const ReportsTab: FC<{ project: Project }> = ({ project }) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  useEffect(() => { if (project.sprints?.length > 0) setSelectedSprintId(project.sprints[0].id); }, [project.sprints]);
  return (<div className="p-4 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold mb-4">Burndown Chart</h3><select value={selectedSprintId || ""} onChange={(e) => setSelectedSprintId(e.target.value)} className="p-2 border rounded mb-4"><option value="">Select Sprint</option>{project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><BurndownChart sprintId={selectedSprintId} /></div>);
};

const DocumentsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const file = fd.get("file") as File; if (!file || file.size === 0) return; const doc = { filename: file.name, url: `/uploads/${file.name}`, filetype: file.type }; await fetch(`/api/projects/${project.id}/documents`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) }); onUpdate(); e.currentTarget.reset(); };
  const handleDelete = async (docId: string) => { if (confirm("Are you sure?")) { await fetch(`/api/documents/${docId}`, { method: 'DELETE' }); onUpdate(); } };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1"><form onSubmit={handleUpload} className="p-4 bg-white rounded-lg shadow-md space-y-4"><h3 className="text-xl font-semibold">Upload Document</h3><input type="file" name="file" required className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" /><button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded">Upload</button></form></div>
      <div className="md:col-span-2"><div className="p-4 bg-white rounded-lg shadow-md space-y-4"><h3 className="text-xl font-semibold">Project Documents</h3>{(project.documents || []).map(doc => (<div key={doc.id} className="p-3 border rounded flex justify-between items-center"><div><a href={doc.url} download={doc.filename} className="font-semibold text-indigo-600 hover:underline">{doc.filename}</a><p className="text-sm text-gray-500">v{doc.version} - Uploaded by {doc.uploadedBy?.name}</p></div><button onClick={() => handleDelete(doc.id)} className="text-red-500 font-bold px-2">X</button></div>))}</div></div>
    </div>
  );
};

// --- Main Project Page ---
export default function ProjectPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState("sprints");
  const [project, setProject] = useState<Project | null>(null);

  const fetchProject = async () => {
    if (session) {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) setProject(await res.json());
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    }
  };

  useEffect(() => {
    fetchProject();
  }, [session, projectId]);

  if (!project) return <div className="p-8">Loading project...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="mb-8"><Link href="/" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</Link><h1 className="text-4xl font-bold text-gray-900 mt-2">{project.name}</h1></header>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('sprints')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sprints' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>Sprints</button>
          <Link href={`/projects/${projectId}/board`} className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500">Board</Link>
          <button onClick={() => setActiveTab('evaluations')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'evaluations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>Evaluations</button>
          <button onClick={() => setActiveTab('reports')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>Reports</button>
          <button onClick={() => setActiveTab('documents')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>Documents</button>
        </nav>
      </div>
      <div>
        {activeTab === 'sprints' && <SprintsTab project={project} onUpdate={fetchProject} />}
        {activeTab === 'evaluations' && <EvaluationsTab project={project} onUpdate={fetchProject} />}
        {activeTab === 'reports' && <ReportsTab project={project} />}
        {activeTab === 'documents' && <DocumentsTab project={project} onUpdate={fetchProject} />}
      </div>
    </div>
  );
}
