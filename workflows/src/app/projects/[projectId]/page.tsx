"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { Project, Sprint, UserStory } from "@/types";
import { ScrumRole } from "@prisma/client";

export default function ProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);

  const fetchProject = async () => {
    if (session) {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) setProject(await res.json());
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchProject();
  }, [status, session, projectId]);

  const handleCreateSprint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSprint = {
      name: formData.get("name") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };
    await fetch(`/api/projects/${projectId}/sprints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSprint),
    });
    fetchProject(); // Refetch to show the new sprint
    e.currentTarget.reset();
  };

  const handleAssignSprint = async (storyId: string, sprintId: string | null) => {
    await fetch(`/api/stories/${storyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sprintId }),
    });
    fetchProject(); // Refetch to update story's sprint
  };

  if (status === "loading" || !project) return <div>Loading...</div>;

  const unassignedStories = project.stories.filter(story => !story.sprintId);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{project.name}</h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Management Column */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Create Sprint</h2>
              <form onSubmit={handleCreateSprint} className="space-y-4">
                <input name="name" type="text" placeholder="Sprint Name" required className="w-full p-2 border rounded" />
                <input name="startDate" type="date" required className="w-full p-2 border rounded" />
                <input name="endDate" type="date" required className="w-full p-2 border rounded" />
                <button type="submit" className="w-full p-2 text-white bg-indigo-600 rounded">Create Sprint</button>
              </form>
            </div>
            {/* Other management forms like Create User Story can go here */}
          </aside>

          {/* Backlog Column */}
          <section className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4">Backlog</h2>
              <div className="space-y-4">
                {unassignedStories.map(story => (
                  <div key={story.id} className="p-4 border rounded shadow-sm">
                    <h3 className="font-semibold">{story.title}</h3>
                    <p className="text-sm text-gray-600">{story.description}</p>
                    <select
                      className="w-full mt-2 p-1 border rounded text-sm"
                      value={story.sprintId || ""}
                      onChange={(e) => handleAssignSprint(story.id, e.target.value || null)}
                    >
                      <option value="">Assign to Sprint...</option>
                      {project.sprints.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sprints Column */}
          <section className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4">Sprints</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {project.sprints.map(sprint => (
                  <div key={sprint.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-lg">{sprint.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      {sprint.stories.map(story => (
                        <div key={story.id} className="p-2 border bg-white rounded shadow-sm">
                           <p className="font-semibold">{story.title}</p>
                           <button onClick={() => handleAssignSprint(story.id, null)} className="text-xs text-red-500 hover:underline">Unassign</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
