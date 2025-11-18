
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// UPDATE a sprint
export async function PUT(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;
    const updatedSprint = await prisma.sprint.update({
      where: { id: params.sprintId },
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updatedSprint);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE a sprint
export async function DELETE(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Unassign stories from this sprint before deleting
    await prisma.userStory.updateMany({
      where: { sprintId: params.sprintId },
      data: { sprintId: null },
    });

    await prisma.sprint.delete({ where: { id: params.sprintId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
