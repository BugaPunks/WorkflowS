import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { sprintId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: 'COMPLETED',
        userStory: {
          sprintId: params.sprintId,
        },
      },
      include: {
        assignedTo: true,
      },
    });

    const contributionMap: { [userId: string]: { userName: string, completedTasks: number, storyPoints: number } } = {};

    for (const task of tasks) {
      if (task.assignedTo) {
        if (!contributionMap[task.assignedTo.id]) {
          contributionMap[task.assignedTo.id] = {
            userName: task.assignedTo.name || 'Unnamed User',
            completedTasks: 0,
            storyPoints: 0,
          };
        }
        contributionMap[task.assignedTo.id].completedTasks += 1;
        contributionMap[task.assignedTo.id].storyPoints += task.storyPoints || 0;
      }
    }

    return NextResponse.json(Object.values(contributionMap));
  } catch (error) {
    console.error("Failed to generate contribution data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
