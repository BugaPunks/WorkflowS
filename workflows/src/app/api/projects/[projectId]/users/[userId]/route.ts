import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    projectId: string;
    userId: string;
  }>;
};

// UPDATE a user's role in a project
export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { role } = await req.json();
    const { projectId, userId } = await context.params;

    const updatedProjectUser = await prisma.projectUser.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
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

// DELETE a user from a project
export async function DELETE(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { projectId, userId } = await context.params;

    await prisma.projectUser.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
