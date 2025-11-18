# Iteración 3: Seguimiento y Kanban

## Codificación

### Implementación del Tablero Kanban y Gráficos de Seguimiento
Se implementó el tablero Kanban para la visualización y gestión del estado de las tareas, y se desarrollaron los endpoints de la API para obtener las métricas de seguimiento.

**Archivos Relevantes:**
A continuación se detallan los archivos de código fuente correspondientes a esta iteración:

*   **`src/app/components/KanbanBoard.tsx`**: Componente de React que renderiza el tablero Kanban y gestiona la funcionalidad de arrastrar y soltar. *(Nota: El nombre del archivo puede variar, este es un ejemplo representativo)*.
*   **`src/app/api/tasks/[taskId]/route.ts`**: Gestiona la actualización del estado de una tarea, utilizado por el tablero Kanban.
*   **`src/app/api/projects/[projectId]/sprints/metrics/route.ts`**: Proporciona métricas sobre los Sprints de un proyecto.
*   **`src/app/api/sprints/[sprintId]/burndown/route.ts`**: Proporciona los datos para generar el gráfico de Burndown de un Sprint.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en los directorios `src/app/components` y `src/app/api`.
- **Tablero Kanban Funcional:** El tablero Kanban está operativo.
