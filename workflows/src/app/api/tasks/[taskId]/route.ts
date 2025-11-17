import { PrismaClient, TaskStatus } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// UPDATE a task
export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { title, description, storyPoints, status, assignedToId } = body;

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title,
        description,
        storyPoints,
        status,
        assignedToId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE a task
export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Delete related comments and documents first
    await prisma.comment.deleteMany({ where: { taskId: params.taskId } });
    await prisma.document.deleteMany({ where: { taskId: params.taskId } });

    await prisma.task.delete({ where: { id: params.taskId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
