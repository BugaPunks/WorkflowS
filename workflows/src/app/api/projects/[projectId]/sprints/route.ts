import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

// GET all sprints for a project
export async function GET(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectId } = await context.params;
    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      orderBy: { startDate: "asc" },
      include: { stories: true },
    });
    return NextResponse.json(sprints);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// CREATE a new sprint in a project
export async function POST(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;
    const { projectId } = await context.params;

    if (!name || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectId,
      },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
