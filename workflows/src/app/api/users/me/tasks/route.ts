
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { handleApiError } from "@/lib/error-utils";

// GET all tasks assigned to the current user with full context
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
      },
      include: {
        userStory: {
          select: { // Use select for precision
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return handleApiError(error);
  }
}
