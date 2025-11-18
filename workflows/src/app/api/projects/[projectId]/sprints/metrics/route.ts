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
    const sprints = await prisma.sprint.findMany({
      where: { projectId: params.projectId },
      include: {
        stories: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sprintMetrics = sprints.map(sprint => {
      const allTasks = sprint.stories.flatMap(story => story.tasks);
      const completedTasks = allTasks.filter(task => task.status === 'COMPLETED');
      const progress = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

      return {
        id: sprint.id,
        name: sprint.name,
        progress: Math.round(progress),
        tasksCompleted: completedTasks.length,
        totalTasks: allTasks.length,
        endDate: sprint.endDate.toISOString(),
      };
    });

    return NextResponse.json(sprintMetrics);
  } catch (error) {
    console.error("Error fetching sprint metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}