import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projectUser = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: params.projectId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!projectUser) {
      return NextResponse.json({ error: "User not in project" }, { status: 404 });
    }

    return NextResponse.json({ 
      scrumRole: projectUser.role,
      projectId: params.projectId 
    });
  } catch (error) {
    console.error("Error fetching scrum role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}