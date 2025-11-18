"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import NotificationsBell from "./NotificationsBell";
import SearchBar from "./SearchBar";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            WorkflowS
          </Link>

          <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
            <SearchBar className="flex-1" />
          </div>

          <div className="flex items-center space-x-4">
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin/users" className="text-gray-700 hover:text-indigo-600">
                Gestión de Usuarios
              </Link>
            )}

            <Link href="/projects" className="text-gray-700 hover:text-indigo-600">
              Proyectos
            </Link>

            <NotificationsBell />

            <button
              onClick={() => signOut()}
              className="text-gray-700 hover:text-indigo-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}