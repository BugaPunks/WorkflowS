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

#### Creación de una Tarea
Este fragmento de código muestra cómo se crea una nueva tarea en la base de datos, asociándola a una historia de usuario.

```typescript
// workflows/src/app/api/stories/[storyId]/tasks/route.ts
const task = await prisma.task.create({
  data: {
    title,
    description,
    userStoryId: params.storyId,
    assignedToId,
  },
});

return NextResponse.json(task);
```

#### Actualización de una Tarea
Este fragmento de código muestra cómo se actualiza una tarea en la base de datos con los nuevos datos proporcionados.

```typescript
// workflows/src/app/api/tasks/[taskId]/route.ts
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
```
