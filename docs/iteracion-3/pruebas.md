# Iteración 3: Seguimiento y Kanban

## Pruebas

### Validación del Tablero Kanban y las Métricas
Se realizaron pruebas de integración para asegurar el correcto funcionamiento del tablero Kanban y la obtención de métricas de seguimiento.

**Tests Relevantes:**
A continuación se detallan los archivos de prueba correspondientes a esta iteración:

*   **`tests/api/tasks.test.ts`**: Incluye pruebas para la actualización del estado de las tareas, que es fundamental para el tablero Kanban.
*   **`tests/api/projects-sprints-metrics.test.ts`**: Valida el endpoint que proporciona las métricas de los Sprints.
*   **`tests/api/sprints-burndown.test.ts`**: Prueba el endpoint que genera los datos para el gráfico de Burndown.

*(Nota: No se encontró un archivo de prueba específico para el componente del tablero Kanban, como `KanbanBoard.test.tsx`. Se recomienda añadir pruebas de frontend para este componente en futuras iteraciones.)*

### Verificación Manual
Se probó exhaustivamente la funcionalidad de arrastrar y soltar tareas en el tablero Kanban, verificando que los cambios de estado se persistieran correctamente en la base de datos y se reflejaran en tiempo real.

*   **Resultados:** Se identificó y corrigió un problema de concurrencia que ocurría cuando dos usuarios movían la misma tarea simultáneamente.

### Entregables
- **Reporte de Pruebas:** Los resultados de las pruebas se generan al ejecutar `npm test`.
- **Correcciones Implementadas:** Las correcciones se encuentran en el historial de commits.
