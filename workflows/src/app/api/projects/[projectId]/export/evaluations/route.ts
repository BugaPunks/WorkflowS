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

    // Get evaluations data
    const evaluations = await prisma.evaluation.findMany({
      where: { projectId: params.projectId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evaluator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { student: { name: 'asc' } },
        { createdAt: 'desc' },
      ],
    });

    // Create export record
    const exportRecord = await prisma.exportHistory.create({
      data: {
        userId: session.user.id,
        projectId: params.projectId,
        type: 'EVALUATIONS',
        format: 'CSV',
        fileName: `evaluations-${params.projectId}-export.csv`,
        status: 'processing',
      },
    });

    // Generate CSV
    let csv = 'Evaluations Export\n';
    csv += 'Student ID,Student Name,Student Email,Evaluator,Sprint,Score,Feedback,Date\n';

    evaluations.forEach((evaluation) => {
      csv += `"${evaluation.student.id}","${evaluation.student.name}","${evaluation.student.email}","${evaluation.evaluator.name}","${evaluation.sprint?.name || 'N/A'}","${evaluation.score}","${evaluation.feedback || ''}","${evaluation.createdAt.toISOString()}"\n`;
    });

    // Update export record as completed
    await prisma.exportHistory.update({
      where: { id: exportRecord.id },
      data: {
        status: 'completed',
        fileSize: Buffer.byteLength(csv, 'utf8'),
        completedAt: new Date(),
      },
    });

    const fileName = `evaluations-${params.projectId}-export.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Error exporting evaluations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}