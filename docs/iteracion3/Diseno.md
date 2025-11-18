# Diseño de la Iteración 3: Seguimiento y Kanban

## Modelo de Datos

El modelo de datos para el seguimiento de tareas y el tablero Kanban se define en el archivo `prisma/schema.prisma`. A continuación se detallan los modelos y enums relevantes para esta iteración.

### Enums

#### TaskStatus

Define los posibles estados de una tarea.

```prisma
enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

### Modelos

#### Task

Representa una tarea dentro de una historia de usuario.

```prisma
model Task {
  id           String     @id @default(cuid())
  title        String
  description  String?
  storyPoints  Int?
  status       TaskStatus @default(PENDING)
  userStory    UserStory  @relation(fields: [userStoryId], references: [id])
  userStoryId  String
  assignedTo   User?      @relation("AssignedTasks", fields: [assignedToId], references: [id])
  assignedToId String?
  documents    Document[]
  comments     Comment[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
```
