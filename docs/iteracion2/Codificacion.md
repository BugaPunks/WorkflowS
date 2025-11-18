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

#### Creación de un Sprint
Este fragmento de código muestra cómo se crea un nuevo sprint en la base de datos con los datos proporcionados.

```typescript
// workflows/src/app/api/projects/[projectId]/sprints/route.ts
const sprint = await prisma.sprint.create({
  data: {
    name,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    projectId: params.projectId,
  },
});

return NextResponse.json(sprint);
```

#### Eliminación de un Sprint
Este fragmento de código muestra cómo se eliminan las referencias de las historias de usuario a un sprint antes de eliminar el sprint en sí.

```typescript
// workflows/src/app/api/sprints/[sprintId]/route.ts
await prisma.userStory.updateMany({
  where: { sprintId: params.sprintId },
  data: { sprintId: null },
});

await prisma.sprint.delete({ where: { id: params.sprintId } });

return new NextResponse(null, { status: 204 });
```
