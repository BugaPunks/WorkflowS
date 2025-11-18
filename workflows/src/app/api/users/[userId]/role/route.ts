
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { handleApiError, ERROR_MESSAGES } from "@/lib/error-utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await requireAdmin();

    const { role } = await req.json();

    if (!role || !['ADMIN', 'DOCENTE', 'ESTUDIANTE'].includes(role)) {
      return NextResponse.json(
        { error: { message: ERROR_MESSAGES.INVALID_ROLE, statusCode: 400 } },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}
