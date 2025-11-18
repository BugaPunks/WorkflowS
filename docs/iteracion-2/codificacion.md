# Iteración 2: Sprints y Backlogs

## Codificación

### Implementación de la Gestión de Sprints y Backlogs
Se desarrollaron los endpoints de la API y los componentes de la interfaz de usuario para gestionar los Sprints, el Product Backlog (historias de usuario) y las tareas.

**Archivos de la API Relevantes:**
A continuación se detallan los archivos de la API correspondientes a esta iteración:

*   **`src/app/api/sprints/route.ts`**: Gestiona la creación de Sprints.
*   **`src/app/api/sprints/[sprintId]/route.ts`**: Gestiona la obtención, actualización y eliminación de un Sprint específico.
*   **`src/app/api/projects/[projectId]/sprints/route.ts`**: Gestiona los Sprints dentro de un proyecto.
*   **`src/app/api/stories/route.ts`**: Gestiona la creación de historias de usuario.
*   **`src/app/api/stories/[storyId]/route.ts`**: Gestiona la obtención, actualización y eliminación de una historia de usuario.
*   **`src/app/api/stories/[storyId]/tasks/route.ts`**: Gestiona las tareas de una historia de usuario.
*   **`src/app/api/tasks/route.ts`**: Gestiona la creación de tareas.
*   **`src/app/api/tasks/[taskId]/route.ts`**: Gestiona la obtención, actualización y eliminación de una tarea.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en el directorio `src/`.
- **Módulo de Sprints Funcional:** La creación y gestión de Sprints, el Backlog y las tareas están operativos.
