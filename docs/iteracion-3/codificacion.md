# Iteración 3: Seguimiento y Kanban

## Codificación

### Implementación del Tablero Kanban
Se implementó el tablero Kanban utilizando la librería `react-beautiful-dnd`.

**Snippet de Código Relevante:**
A continuación, se muestra un fragmento del componente del tablero Kanban.

*   **Título:** `KanbanBoard`
*   **Nota:** Este componente renderiza las columnas y las tareas, y maneja la lógica de arrastrar y soltar.

```typescript
// src/components/KanbanBoard.tsx

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function KanbanBoard({ tasks }) {
  const onDragEnd = (result) => {
    // ... Lógica para actualizar el estado de la tarea
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* ... */}
    </DragDropContext>
  );
}
```

### Desarrollo del Sistema de Estados de Tareas
La API se actualizó para permitir la modificación del estado de una tarea.

*   **Estado:** Implementado.

### Programación de Gráficos de Avance
Se integró la librería `Recharts` para generar el gráfico de Burndown.

*   **Estado:** Implementado, pero requiere más datos de prueba para ser visualmente útil.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en el directorio `src/`.
- **Tablero Kanban Funcional:** El tablero Kanban está operativo y permite actualizar el estado de las tareas.
