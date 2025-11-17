import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { sprintId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { sprintId: params.sprintId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Failed to fetch evaluations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
