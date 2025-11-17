import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all comments for a task
export async function GET(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: params.taskId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST a new comment to a task
export async function POST(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { text } = body;
    if (!text) return new NextResponse("Comment text is required", { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        text,
        taskId: params.taskId,
        authorId: session.user.id,
      },
      include: { author: { select: { id: true, name: true } } }
    });

    // Optional: Create notification for task owner/assignee
    // ...

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
