import { NextResponse } from "next/server";
import { requireDocente } from "@/lib/auth-utils";
import { handleApiError, ERROR_MESSAGES } from "@/lib/error-utils";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await requireDocente();

  const body = await req.json();
  const { sprintId, studentId, score, feedback } = body;

  if (!sprintId || !studentId || score === undefined) {
    return NextResponse.json(
      { error: { message: ERROR_MESSAGES.MISSING_FIELDS, statusCode: 400 } },
      { status: 400 }
    );
  }

  // Get projectId from sprint
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    select: { projectId: true },
  });
  if (!sprint) {
    return NextResponse.json(
      { error: { message: ERROR_MESSAGES.SPRINT_NOT_FOUND, statusCode: 404 } },
      { status: 404 }
    );
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      projectId: sprint.projectId,
      sprintId,
      studentId,
      evaluatorId: session.user.id,
      score: Number(score),
      feedback,
    },
  });

  return NextResponse.json(evaluation);
}
