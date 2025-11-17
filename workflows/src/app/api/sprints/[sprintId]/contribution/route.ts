import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { sprintId: string } }) {
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
        assignedTo: { select: { id: true, name: true } },
      },
    });

    const contribution = tasks.reduce((acc, task) => {
      if (!task.assignedTo) return acc;

      const userId = task.assignedTo.id;
      if (!acc[userId]) {
        acc[userId] = {
          userId: userId,
          userName: task.assignedTo.name,
          tasksCompleted: 0,
          storyPointsContributed: 0,
        };
      }
      acc[userId].tasksCompleted += 1;
      acc[userId].storyPointsContributed += task.storyPoints || 0;

      return acc;
    }, {} as any);

    return NextResponse.json(Object.values(contribution));
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
