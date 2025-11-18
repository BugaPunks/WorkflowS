
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, assignedToId } = body;

    if (!title) {
      return new NextResponse("Title is a required field", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userStoryId: params.storyId,
        assignedToId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
