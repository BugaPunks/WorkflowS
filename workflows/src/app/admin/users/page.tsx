"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, RoleName } from "@/types";
import UserList from "@/app/components/UserList";
import UserForm from "@/app/components/UserForm";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        setShowCreateForm(false);
        // Refresh will be handled by UserList
      }
    } catch (error) {
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        setEditingUser(null);
        // Refresh will be handled by UserList
      }
    } catch (error) {
    }
  };

  if (status === "loading" || session?.user?.role !== "ADMIN") {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Crear Usuario
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {editingUser && (
        <div className="mb-6">
          <UserForm
            user={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}

      <UserList
        onEditUser={setEditingUser}
      />
    </div>
  );
}