import { PrismaClient, TaskStatus } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { status, assignedToId } = body;

    // Get the task before updating to check old values
    const originalTask = await prisma.task.findUnique({ where: { id: params.taskId }, include: { userStory: true }});

    if (!originalTask) {
      return new NextResponse("Task not found", { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        status,
        assignedToId,
      },
    });

    // --- Notification Logic ---
    // If a task is assigned to a user (and it wasn't assigned to them before)
    if (assignedToId && originalTask.assignedToId !== assignedToId) {
      await prisma.notification.create({
        data: {
          userId: assignedToId,
          message: `You have been assigned a new task: "${updatedTask.title}"`,
          link: `/projects/${originalTask.userStory.projectId}/board`,
        },
      });
    }
    // --- End Notification Logic ---

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
