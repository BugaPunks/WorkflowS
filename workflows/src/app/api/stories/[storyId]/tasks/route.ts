import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    storyId: string;
  }>;
};

// CREATE a new task for a user story
export async function POST(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, assignedToId } = body;
    const { storyId } = await context.params;

    if (!title) {
      return new NextResponse("Title is a required field", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userStoryId: storyId,
        assignedToId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to create task", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
