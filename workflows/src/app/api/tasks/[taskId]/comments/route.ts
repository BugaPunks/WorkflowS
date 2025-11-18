import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET handler to fetch comments for a task
export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: params.taskId },
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST handler to create a new comment
export async function POST(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  if (!session || !user.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { text } = await req.json();
    if (!text) {
      return new NextResponse("Comment text is required", { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        taskId: params.taskId,
        authorId: user.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
