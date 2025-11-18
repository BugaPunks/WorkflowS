import { NextRequest, NextResponse } from "next/server";
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
    // Get URL parameters for date filtering
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start');
    const endDate = url.searchParams.get('end');

    let whereClause: any = {
      projectId: params.projectId,
    };

    // Add date filtering if provided
    if (startDate && endDate) {
      whereClause.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, type, startDate, endDate, allDay, color, sprintId } = body;

    if (!title || !type || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, type, startDate" },
        { status: 400 }
      );
    }

    // Verify user has access to project
    const projectUser = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: params.projectId,
        },
      },
    });

    if (!projectUser) {
      return NextResponse.json({ error: "Not a member of this project" }, { status: 403 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay: allDay || false,
        color,
        projectId: params.projectId,
        sprintId,
        createdById: session.user.id,
      },
      include: {
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}