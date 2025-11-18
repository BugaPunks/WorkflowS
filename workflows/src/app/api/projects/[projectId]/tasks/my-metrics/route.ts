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
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
        userStory: {
          project: {
            id: params.projectId,
          },
        },
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Obtener el sprint actual para contar tareas del sprint
    const currentSprint = await prisma.sprint.findFirst({
      where: {
        projectId: params.projectId,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    // Para obtener tareas del sprint actual, necesitamos hacer una consulta separada
    const currentSprintTasks = currentSprint
      ? await prisma.task.count({
          where: {
            assignedToId: session.user.id,
            userStory: {
              sprintId: currentSprint.id,
            },
          },
        })
      : 0;

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      currentSprintTasks,
    });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}