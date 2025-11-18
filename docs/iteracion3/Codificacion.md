# Codificación de la Iteración 3: Seguimiento y Kanban

## Creación y Gestión de Tareas

La creación y gestión of tareas se maneja a través de varias rutas de API.

### `POST /api/stories/{storyId}/tasks`

Esta función maneja la creación de una nueva tarea en una historia de usuario.

- **Propósito:** Registrar un nueva tarea en una historia de usuario.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo:
    - `title` (string): El título de la tarea.
    - `description` (string): La descripción de la tarea.
    - `assignedToId` (string): El ID del usuario asignado a la tarea.
- **Retorno:** Un objeto `NextResponse` con la tarea creada en formato JSON o un mensaje de error.

### `PUT /api/tasks/{taskId}`

Esta función maneja la actualización de una tarea.

- **Propósito:** Actualizar una tarea existente.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo los campos a actualizar.
  - `params`: Contiene el `taskId`.
- **Retorno:** Un objeto `NextResponse` con la tarea actualizada en formato JSON o un mensaje de error.

### `DELETE /api/tasks/{taskId}`

Esta función maneja la eliminación de una tarea.

- **Propósito:** Eliminar una tarea existente.
- **Parámetros:**
  - `req`: El objeto de solicitud.
  - `params`: Contiene el `taskId`.
- **Retorno:** Un objeto `NextResponse` con un estado 204 si la eliminación fue exitosa, o un mensaje de error.

#### Código de Ejemplo

```typescript
// workflows/src/app/api/stories/[storyId]/tasks/route.ts

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, assignedToId } = body;

    if (!title) {
      return new NextResponse("Title is a required field", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userStoryId: params.storyId,
        assignedToId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

```typescript
// workflows/src/app/api/tasks/[taskId]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { title, description, storyPoints, status, assignedToId } = body;

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title,
        description,
        storyPoints,
        status,
        assignedToId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Delete related comments and documents first
    await prisma.comment.deleteMany({ where: { taskId: params.taskId } });
    await prisma.document.deleteMany({ where: { taskId: params.taskId } });

    await prisma.task.delete({ where: { id: params.taskId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```
