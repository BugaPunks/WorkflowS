# Iteración 2: Sprints y Backlogs

## Pruebas

### Validación de la Creación y Gestión de Sprints y Backlogs
Se realizaron pruebas unitarias y de integración para verificar la correcta implementación de la funcionalidad de Sprints y Backlogs.

**Tests Relevantes:**
A continuación se detallan los archivos de prueba correspondientes a esta iteración:

*   **`tests/api/sprints.test.ts`**: Valida el CRUD de Sprints.
*   **`tests/api/projects-sprints.test.ts`**: Prueba la creación y obtención de Sprints dentro de un proyecto.
*   **`tests/api/stories.test.ts`**: Valida el CRUD de historias de usuario.
*   **`tests/api/stories-tasks.test.ts`**: Prueba la creación y obtención de tareas asociadas a una historia de usuario.
*   **`tests/api/tasks.test.ts`**: Valida el CRUD de tareas.

### Verificación Manual
Se probó manualmente el flujo de creación de un Sprint, la adición de historias de usuario al backlog y la creación de tareas para esas historias.

*   **Resultados:** Se identificó y corrigió un error menor en la actualización de la interfaz de usuario después de asignar una tarea.

### Entregables
- **Reporte de Pruebas:** Los resultados de las pruebas se generan al ejecutar `npm test`.
- **Correcciones Implementadas:** Las correcciones se encuentran en el historial de commits.
