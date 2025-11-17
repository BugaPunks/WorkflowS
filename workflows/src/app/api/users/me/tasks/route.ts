import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all tasks assigned to the current user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
      },
      include: {
        userStory: {
          include: {
            project: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
