# Iteración 2: Sprints y Backlogs

## Codificación

### Implementación de la Creación y Gestión de Sprints
Se desarrollaron los endpoints de la API y los componentes de la interfaz de usuario para gestionar los Sprints.

*   **Estado:** Implementado.

### Desarrollo del Sistema de Backlog
Se implementó la funcionalidad para crear, modificar y priorizar historias de usuario en el Product Backlog.

**Snippet de Código Relevante:**
A continuación, se muestra la función para actualizar la prioridad de una historia de usuario.

*   **Título:** `updateStoryPriority`
*   **Nota:** Esta función recibe el ID de la historia y la nueva prioridad, y actualiza el registro en la base de datos.

```typescript
// src/actions/story-actions.ts

export async function updateStoryPriority(id: string, priority: number) {
  await prisma.story.update({
    where: { id },
    data: { priority },
  });
  // ...
}
```

### Programación de la Asignación de Tareas
Se implementó la funcionalidad para que los miembros del equipo puedan crear tareas y asignarlas a otros miembros.

*   **Estado:** Implementado. La funcionalidad de arrastrar y soltar en el tablero Kanban está pendiente.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en el directorio `src/`.
- **Módulo de Sprints Funcional:** La creación y gestión de Sprints y el Backlog están operativos.
