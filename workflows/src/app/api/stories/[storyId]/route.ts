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

// UPDATE a user story (e.g., assign to a sprint)
export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { sprintId } = body;
    const { storyId } = await context.params;

    const updatedStory = await prisma.userStory.update({
      where: { id: storyId },
      data: {
        sprintId: sprintId || null, // Allow unassigning
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Failed to update user story", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
