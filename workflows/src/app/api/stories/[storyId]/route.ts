import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { sprintId } = body;

    const updatedStory = await prisma.userStory.update({
      where: { id: params.storyId },
      data: {
        sprintId: sprintId || null,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Failed to update user story", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
