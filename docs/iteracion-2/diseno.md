# Iteración 2: Sprints y Backlogs

## Diseño

### Diseño de la Interfaz
Se diseñaron las siguientes interfaces:
- **Vista de Sprints:** Una interfaz para crear, ver, actualizar y eliminar Sprints dentro de un proyecto.
- **Vista del Backlog:** Una lista de historias de usuario que se pueden priorizar y asignar a Sprints.
- **Vista de Tareas:** Una interfaz para crear y asignar tareas a los miembros del equipo.

*Nota: Los prototipos de alta fidelidad se encuentran en Figma.*

### Modelado del Backlog de Productos
El backlog se modeló como una relación entre Proyectos, Sprints e Historias de Usuario.

```prisma
// schema.prisma

model Sprint {
  id          String   @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  stories     Story[]
}

model Story {
  id          String   @id @default(cuid())
  title       String
  description String
  priority    Int
  sprintId    String?
  sprint      Sprint?  @relation(fields: [sprintId], references: [id])
  tasks       Task[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  status      String   @default("PENDIENTE")
  storyId     String
  story       Story    @relation(fields: [storyId], references: [id])
  assigneeId  String?
  assignee    User?    @relation(fields: [assigneeId], references: [id])
}
```
*Nota: Este es un extracto del esquema de la base de datos que muestra el modelo del backlog.*

### Diseño de la Visualización de Tareas
Las tareas se visualizarán en un tablero Kanban, con columnas que representan los estados "Pendiente", "En Progreso" y "Completado".

### Entregables
- **Prototipos de Interfaz:** Enlace a los diseños en Figma.
- **Diagrama de Flujo de Trabajo:** Un diagrama que ilustra el flujo de una historia de usuario desde el backlog hasta su finalización en un Sprint.
