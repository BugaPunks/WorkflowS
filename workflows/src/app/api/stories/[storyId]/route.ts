
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// UPDATE a user story
export async function PUT(req: NextRequest, { params }: { params: { storyId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    // Destructure all editable fields
    const { title, description, acceptanceCriteria, priority, status, sprintId } = body;

    const updatedStory = await prisma.userStory.update({
      where: { id: params.storyId },
      data: {
        title,
        description,
        acceptanceCriteria,
        priority,
        status,
        sprintId,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE a user story
export async function DELETE(req: NextRequest, { params }: { params: { storyId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Need to delete related tasks first
    await prisma.task.deleteMany({ where: { userStoryId: params.storyId } });

    await prisma.userStory.delete({ where: { id: params.storyId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
