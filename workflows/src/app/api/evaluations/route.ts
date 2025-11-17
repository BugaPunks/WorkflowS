import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoleName } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: RoleName };

  if (!session || user?.role !== RoleName.TEACHER) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const { sprintId, studentId, score, feedback } = body;

    if (!sprintId || !studentId || score === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        sprintId,
        studentId,
        evaluatorId: user.id as string,
        score: Number(score),
        feedback,
      },
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation creation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
