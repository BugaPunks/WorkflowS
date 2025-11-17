import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, startDate, endDate, users } = body;

    if (!name || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        users: {
          create: users.map((user: { userId: string; role: string }) => ({
            userId: user.userId,
            role: user.role,
          })),
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
