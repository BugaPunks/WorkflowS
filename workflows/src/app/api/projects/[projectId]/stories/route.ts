import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, priority } = body;
    const { projectId } = params;

    if (!title || !priority) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const story = await prisma.userStory.create({
      data: {
        title,
        description,
        priority,
        projectId,
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { projectId } = params;
    const stories = await prisma.userStory.findMany({
      where: {
        projectId,
      },
      orderBy: {
        priority: "asc",
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
