"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, User } from "@/types";
import { ScrumRole } from "@prisma/client";

interface TeamMember {
  userId: string;
  role: ScrumRole;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      Promise.all([fetch("/api/projects"), fetch("/api/users/list")])
        .then(([projRes, userRes]) => Promise.all([projRes.json(), userRes.json()]))
        .then(([projData, userData]) => {
          setProjects(projData);
          setUsers(userData);
        })
        .catch(console.error);
    }
  }, [session]);

  const handleAddTeamMember = () => setTeam([...team, { userId: "", role: "TEAM_DEVELOPER" }]);
  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeam = [...team];
    updatedTeam[index][field] = value as ScrumRole;
    setTeam(updatedTeam);
  };
  const handleRemoveTeamMember = (index: number) => setTeam(team.filter((_, i) => i !== index));

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      users: team,
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    if (res.ok) {
      const createdProject = await res.json();
      setProjects([...projects, createdProject]);
      e.currentTarget.reset();
      setTeam([]);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user?.name}</h1>
          <div>
            {session.user?.role === "ADMIN" && (
              <Link href="/admin/users" className="mr-4 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md shadow-sm hover:bg-gray-700">
                Manage Users
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <input name="name" type="text" placeholder="Project Name" required className="w-full p-2 border rounded" />
                <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" />
                <input name="startDate" type="date" required className="w-full p-2 border rounded" />
                <input name="endDate" type="date" required className="w-full p-2 border rounded" />

                <h3 className="text-lg font-medium text-gray-900 pt-2">Team Members</h3>
                {team.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={member.userId}
                      onChange={(e) => handleTeamMemberChange(index, "userId", e.target.value)}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="">Select User</option>
                      {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </select>
                    <select
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                      className="w-1/2 p-2 border rounded"
                    >
                      <option value="TEAM_DEVELOPER">Developer</option>
                      <option value="SCRUM_MASTER">Scrum Master</option>
                      <option value="PRODUCT_OWNER">Product Owner</option>
                    </select>
                    <button type="button" onClick={() => handleRemoveTeamMember(index)} className="text-red-500 font-bold">X</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddTeamMember} className="w-full p-2 text-indigo-600 border border-indigo-600 rounded">
                  Add Member
                </button>
                <button type="submit" className="w-full p-2 text-white bg-indigo-600 rounded">Create Project</button>
              </form>
            </div>
          </aside>

          <section className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id} className="block p-4 border rounded shadow-sm hover:bg-gray-50">
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
