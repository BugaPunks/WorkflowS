
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth, isDocente, isAdmin } from "@/lib/auth-utils";

// ... (GET function remains the same)

// UPDATE a project
export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await requireAuth();

    // Only DOCENTE or ADMIN can update projects
    if (session.user.role !== 'DOCENTE' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { message: "No tienes permisos para actualizar proyectos", statusCode: 403 } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, startDate, endDate } = body;
    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: { name, description, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          { error: { message: "No autorizado", statusCode: 401 } },
          { status: 401 }
        );
      }
      if (error.message === 'FORBIDDEN') {
        return NextResponse.json(
          { error: { message: "Acceso denegado", statusCode: 403 } },
          { status: 403 }
        );
      }
    }
    return NextResponse.json(
      { error: { message: "Error interno del servidor", statusCode: 500 } },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await requireAuth();

    // Only ADMIN can delete projects (more restrictive than update)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { message: "Solo los administradores pueden eliminar proyectos", statusCode: 403 } },
        { status: 403 }
      );
    }

    // En una aplicación real, sería necesario manejar las eliminaciones en cascada con cuidado.
    // Prisma puede configurarse para esto. Por ahora, eliminamos los registros relacionados manualmente.
    await prisma.projectUser.deleteMany({ where: { projectId: params.projectId } });
    await prisma.document.deleteMany({ where: { projectId: params.projectId } });
    await prisma.evaluation.deleteMany({ where: { projectId: params.projectId } });
    // etc. for all relations

    await prisma.project.delete({ where: { id: params.projectId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          { error: { message: "No autorizado", statusCode: 401 } },
          { status: 401 }
        );
      }
      if (error.message === 'FORBIDDEN') {
        return NextResponse.json(
          { error: { message: "Acceso denegado", statusCode: 403 } },
          { status: 403 }
        );
      }
    }
    return NextResponse.json(
      { error: { message: "Error interno del servidor", statusCode: 500 } },
      { status: 500 }
    );
  }
}
