# Codificación de la Iteración 2: Sprints y Backlogs

## Creación y Gestión de Sprints

La creación y gestión de sprints se maneja a través de varias rutas de API.

### `GET /api/projects/{projectId}/sprints`

Esta función maneja la obtención de todos los sprints de un proyecto.

- **Propósito:** Obtener una lista de todos los sprints de un proyecto.
- **Parámetros:**
  - `req`: El objeto de solicitud.
  - `params`: Contiene el `projectId`.
- **Retorno:** Un objeto `NextResponse` con la lista de sprints en formato JSON o un mensaje de error.

### `POST /api/projects/{projectId}/sprints`

Esta función maneja la creación de un nuevo sprint en un proyecto.

- **Propósito:** Registrar un nuevo sprint en un proyecto.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo:
    - `name` (string): El nombre del sprint.
    - `startDate` (string): La fecha de inicio del sprint.
    - `endDate` (string): La fecha de fin del sprint.
- **Retorno:** Un objeto `NextResponse` con el sprint creado en formato JSON o un mensaje de error.

### `PUT /api/sprints/{sprintId}`

Esta función maneja la actualización de un sprint.

- **Propósito:** Actualizar un sprint existente.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo los campos a actualizar.
  - `params`: Contiene el `sprintId`.
- **Retorno:** Un objeto `NextResponse` con el sprint actualizado en formato JSON o un mensaje de error.

### `DELETE /api/sprints/{sprintId}`

Esta función maneja la eliminación de un sprint.

- **Propósito:** Eliminar un sprint existente.
- **Parámetros:**
  - `req`: El objeto de solicitud.
  - `params`: Contiene el `sprintId`.
- **Retorno:** Un objeto `NextResponse` con un estado 204 si la eliminación fue exitosa, o un mensaje de error.

#### Código de Ejemplo

```typescript
// workflows/src/app/api/projects/[projectId]/sprints/route.ts

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const sprints = await prisma.sprint.findMany({
      where: { projectId: params.projectId },
      orderBy: { startDate: "asc" },
      include: { stories: true },
    });
    return NextResponse.json(sprints);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        projectId: params.projectId,
      },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

```typescript
// workflows/src/app/api/sprints/[sprintId]/route.ts

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { name, startDate, endDate } = body;
    const updatedSprint = await prisma.sprint.update({
      where: { id: params.sprintId },
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return NextResponse.json(updatedSprint);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { sprintId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Unassign stories from this sprint before deleting
    await prisma.userStory.updateMany({
      where: { sprintId: params.sprintId },
      data: { sprintId: null },
    });

    await prisma.sprint.delete({ where: { id: params.sprintId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```
