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
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, assignedToId } = body;

    if (status && !Object.values(TaskStatus).includes(status)) {
      return new NextResponse("Invalid status value", { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: params.taskId },
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
