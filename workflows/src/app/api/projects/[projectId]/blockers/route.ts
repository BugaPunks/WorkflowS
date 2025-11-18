import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Por ahora, simulamos algunos bloqueos de ejemplo
    // En una implementación real, esto vendría de comentarios o un modelo Blocker
    const mockBlockers = [
      {
        id: '1',
        description: 'Esperando aprobación del diseño del cliente',
        taskId: 'task-1',
        reportedBy: 'Juan Pérez',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
      },
      {
        id: '2',
        description: 'Dependencia con el equipo de backend bloqueada',
        taskId: 'task-2',
        reportedBy: 'María García',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
      },
    ];

    return NextResponse.json(mockBlockers);
  } catch (error) {
    console.error("Error fetching blockers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}