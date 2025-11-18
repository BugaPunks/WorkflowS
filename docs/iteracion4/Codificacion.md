# Codificación de la Iteración 4: Evaluación y Calificación

## Creación y Gestión de Evaluaciones

La creación y gestión of evaluaciones se maneja a través de varias rutas de API.

### `GET /api/projects/{projectId}/evaluations`

Esta función maneja la obtención de todas las evaluaciones de un proyecto.

- **Propósito:** Obtener una lista de todas las evaluaciones de un proyecto. Si el usuario es un estudiante, solo devuelve sus evaluaciones.
- **Parámetros:**
  - `req`: El objeto de solicitud.
  - `params`: Contiene el `projectId`.
- **Retorno:** Un objeto `NextResponse` con la lista de evaluaciones en formato JSON o un mensaje de error.

### `POST /api/projects/{projectId}/evaluations`

Esta función maneja la creación de una nueva evaluación en un proyecto.

- **Propósito:** Registrar un nueva evaluación en un proyecto.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo:
    - `sprintId` (string): El ID del sprint.
    - `studentId` (string): El ID del estudiante.
    - `score` (number): La calificación.
    - `feedback` (string): La retroalimentación.
- **Retorno:** Un objeto `NextResponse` con la evaluación creada en formato JSON o un mensaje de error.

#### Código de Ejemplo

```typescript
// workflows/src/app/api/projects/[projectId]/evaluations/route.ts

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```
