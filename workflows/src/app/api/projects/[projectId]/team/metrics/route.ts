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
    const projectUsers = await prisma.projectUser.findMany({
      where: { projectId: params.projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const teamMetrics = await Promise.all(
      projectUsers.map(async (projectUser) => {
        const userTasks = await prisma.task.findMany({
          where: {
            assignedToId: projectUser.userId,
            userStory: {
              project: {
                id: params.projectId,
              },
            },
          },
        });

        const completedTasks = userTasks.filter(task => task.status === 'COMPLETED');
        const pendingTasks = userTasks.filter(task => task.status !== 'COMPLETED');

        return {
          id: projectUser.user.id,
          name: projectUser.user.name || projectUser.user.email,
          tasksCompleted: completedTasks.length,
          tasksPending: pendingTasks.length,
          role: projectUser.role,
        };
      })
    );

    return NextResponse.json(teamMetrics);
  } catch (error) {
    console.error("Error fetching team metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}