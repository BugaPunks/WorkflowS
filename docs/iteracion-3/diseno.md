# Iteración 3: Seguimiento y Kanban

## Diseño

### Diseño del Tablero Kanban
El tablero Kanban se diseñó con tres columnas: "Pendiente", "En Progreso" y "Completado". Cada tarea se representa como una tarjeta que se puede arrastrar entre las columnas.

![Diseño del Tablero Kanban](https://i.imgur.com/8J6m2hD.png)
*Nota: Este es un mockup de alta fidelidad del tablero Kanban.*

### Modelado del Flujo de Trabajo
El flujo de trabajo se modeló con los siguientes estados de tarea: `PENDIENTE`, `EN_PROGRESO`, `COMPLETADO`.

```prisma
// schema.prisma

model Task {
  id          String   @id @default(cuid())
  title       String
  status      TaskStatus @default(PENDIENTE)
  // ...
}

enum TaskStatus {
  PENDIENTE
  EN_PROGRESO
  COMPLETADO
}
```
*Nota: Se utilizó un `enum` en Prisma para representar los estados de las tareas.*

### Diseño de Gráficos de Seguimiento
Se diseñó un gráfico de Burndown para visualizar el progreso del Sprint. El eje X representa el tiempo (días del Sprint) y el eje Y representa el trabajo pendiente (puntos de historia o número de tareas).

### Entregables
- **Prototipos de Interfaz:** Enlace a los diseños en Figma.
- **Diagramas de Flujo:** Diagrama que muestra el flujo de una tarea a través del tablero Kanban.
