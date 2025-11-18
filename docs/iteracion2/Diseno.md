# Diseño de la Iteración 2: Sprints y Backlogs

## Modelo de Datos

El modelo de datos para la gestión de sprints y backlogs se define en el archivo `prisma/schema.prisma`. A continuación se detallan los modelos y enums relevantes para esta iteración.

### Enums

#### UserStoryStatus

Define los posibles estados de una historia de usuario.

```prisma
enum UserStoryStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

### Modelos

#### Sprint

Representa un sprint dentro de un proyecto.

```prisma
model Sprint {
  id          String       @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  project     Project      @relation(fields: [projectId], references: [id])
  projectId   String
  stories     UserStory[]
  // ... otros campos
}
```

#### UserStory

Representa una historia de usuario en el backlog del producto.

```prisma
model UserStory {
  id                  String          @id @default(cuid())
  title               String
  description         String?
  acceptanceCriteria  String?
  priority            Int
  status              UserStoryStatus @default(TODO)
  project             Project         @relation(fields: [projectId], references: [id])
  projectId           String
  sprint              Sprint?         @relation(fields: [sprintId], references: [id])
  sprintId            String?
  tasks               Task[]
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
}
```
