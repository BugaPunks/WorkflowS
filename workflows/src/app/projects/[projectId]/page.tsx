"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { Project, UserStory } from "@/types";
import { ScrumRole } from "@prisma/client";

export default function ProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

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
    fetchProject();
  }, [session, projectId]);

  const handleCreateStory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStory = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: parseInt(formData.get("priority") as string),
    };
    const res = await fetch(`/api/projects/${projectId}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStory),
    });
    if (res.ok) {
      fetchProject(); // Refetch project to get updated stories
      e.currentTarget.reset();
    }
  };

  const handleRoleChange = async (userId: string, newRole: ScrumRole) => {
    await fetch(`/api/projects/${projectId}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    fetchProject();
  };

  const handleRemoveUser = async (userId: string) => {
    if (window.confirm("Remove this user?")) {
      await fetch(`/api/projects/${projectId}/users/${userId}`, { method: 'DELETE' });
      fetchProject();
    }
  };

  if (status === "loading" || !project) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create User Story</h2>
              <form onSubmit={handleCreateStory} className="space-y-4">
                <input name="title" type="text" placeholder="Story Title" required className="w-full p-2 border rounded" />
                <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" />
                <input name="priority" type="number" placeholder="Priority" required className="w-full p-2 border rounded" />
                <button type="submit" className="w-full p-2 text-white bg-indigo-600 rounded">Create Story</button>
              </form>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Team</h2>
              <div className="space-y-3">
                {project.users.map(member => (
                  <div key={member.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{member.user.name}</p>
                      <button onClick={() => handleRemoveUser(member.user.id)} className="text-red-500 font-bold">X</button>
                    </div>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user.id, e.target.value as ScrumRole)}
                      className="w-full mt-2 p-1 border rounded"
                    >
                      <option value="TEAM_DEVELOPER">Developer</option>
                      <option value="SCRUM_MASTER">Scrum Master</option>
                      <option value="PRODUCT_OWNER">Product Owner</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Backlog</h2>
              <div className="space-y-4">
                {project.stories.map(story => (
                  <div key={story.id} className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">{story.title}</h3>
                    <p className="text-gray-600">{story.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <span>Priority: {story.priority}</span>
                      <span className="ml-4 capitalize">Status: {story.status.replace("_", " ").toLowerCase()}</span>
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
