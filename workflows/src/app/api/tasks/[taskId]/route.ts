import { PrismaClient, TaskStatus } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

// UPDATE a task (e.g., change status or assignment)
export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, assignedToId } = body;
    const { taskId } = await context.params;

    // Validate if the status is a valid enum value
    if (status && !Object.values(TaskStatus).includes(status)) {
      return new NextResponse("Invalid status value", { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        assignedToId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to update task", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
