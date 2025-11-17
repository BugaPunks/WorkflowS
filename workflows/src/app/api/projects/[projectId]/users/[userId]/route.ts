import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { role } = await req.json();

    const updatedProjectUser = await prisma.projectUser.update({
      where: {
        userId_projectId: {
          userId: params.userId,
          projectId: params.projectId,
        },
      },
      data: { role },
    });

    return NextResponse.json(updatedProjectUser);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await prisma.projectUser.delete({
      where: {
        userId_projectId: {
          userId: params.userId,
          projectId: params.projectId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
