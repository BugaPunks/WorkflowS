
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { handleApiError, ERROR_MESSAGES } from "@/lib/error-utils";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await req.json();
    const { name, description, startDate, endDate, users } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: { message: ERROR_MESSAGES.MISSING_FIELDS, statusCode: 400 } },
        { status: 400 }
      );
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
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await requireAuth();

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
    return handleApiError(error);
  }
}
