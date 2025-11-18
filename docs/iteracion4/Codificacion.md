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

#### Creación de una Evaluación
Este fragmento de código muestra cómo se crea una nueva evaluación en la base de datos, asociándola a un proyecto, sprint y estudiante.

```typescript
// workflows/src/app/api/projects/[projectId]/evaluations/route.ts
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
```
