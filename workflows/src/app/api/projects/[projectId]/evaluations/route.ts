import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all evaluations for a project (or for a specific student)
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  // ... (existing GET logic)
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const whereClause: any = { projectId: params.projectId };
    if (session.user.role === "ESTUDIANTE") {
      whereClause.studentId = session.user.id;
    }

    const evaluations = await prisma.evaluation.findMany({
      where: whereClause,
      include: {
        student: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// CREATE a new evaluation for a student in a sprint
export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DOCENTE") {
    return new NextResponse("Forbidden: Only teachers can create evaluations", { status: 403 });
  }

  try {
    const body = await req.json();
    const { sprintId, studentId, score, feedback } = body;

    if (!sprintId || !studentId || score === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        score,
        feedback,
        projectId: params.projectId,
        sprintId,
        studentId,
        evaluatorId: session.user.id,
      },
    });

    // --- Notification Logic ---
    await prisma.notification.create({
      data: {
        userId: studentId,
        message: `You have received a new evaluation with a score of ${score.toFixed(1)}.`,
        link: `/projects/${params.projectId}`,
      },
    });
    // --- End Notification Logic ---

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
