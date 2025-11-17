import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all sprints formatted as calendar events
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const sprints = await prisma.sprint.findMany({
      where: { projectId: params.projectId },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
    });

    // Format for FullCalendar or React Big Calendar
    const events = sprints.map(sprint => ({
      id: sprint.id,
      title: sprint.name,
      start: sprint.startDate,
      end: sprint.endDate,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
