import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// ... (GET function remains the same)

// UPDATE a project
export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  // TODO: Add role check (e.g., only DOCENTE or ADMIN)

  try {
    const body = await req.json();
    const { name, description, startDate, endDate } = body;
    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: { name, description, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE a project
export async function DELETE(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  // TODO: Add role check

  try {
    // In a real app, you'd need to handle cascading deletes carefully.
    // Prisma can be configured for this. For now, we delete related records manually.
    await prisma.projectUser.deleteMany({ where: { projectId: params.projectId } });
    await prisma.document.deleteMany({ where: { projectId: params.projectId } });
    await prisma.evaluation.deleteMany({ where: { projectId: params.projectId } });
    // etc. for all relations

    await prisma.project.delete({ where: { id: params.projectId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
