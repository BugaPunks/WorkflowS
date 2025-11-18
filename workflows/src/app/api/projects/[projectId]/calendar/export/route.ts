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
    const events = await prisma.event.findMany({
      where: { projectId: params.projectId },
      include: {
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    // Generate ICS format for calendar export
    const icsContent = generateICSContent(events, params.projectId);

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="project-${params.projectId}-calendar.ics"`,
      },
    });
  } catch (error) {
    console.error("Error exporting calendar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateICSContent(events: any[], projectId: string): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WorkflowS//Calendar Export//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Project ${projectId} Calendar
X-WR-TIMEZONE:UTC
`;

  events.forEach(event => {
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.endDate
      ? event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : startDate;

    ics += `BEGIN:VEVENT
UID:${event.id}@workflow
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
STATUS:CONFIRMED
`;

    if (event.color) {
      ics += `COLOR:${event.color}\n`;
    }

    ics += `END:VEVENT\n`;
  });

  ics += 'END:VCALENDAR';
  return ics;
}