# Iteración 3: Seguimiento y Kanban

## Pruebas

### Validar el Cambio de Estados en Tareas
Se realizaron pruebas manuales exhaustivas para verificar que el cambio de estado de las tareas mediante "arrastrar y soltar" en el tablero Kanban funciona correctamente.

*   **Resultados:** Se identificó y corrigió un problema de concurrencia que ocurría cuando dos usuarios movían la misma tarea simultáneamente.

### Probar la Actualización de Gráficos
Se probó la actualización de los gráficos de seguimiento con datos de prueba.

*   **Resultados:** Los gráficos se actualizan correctamente, pero se necesita una mayor variedad de datos para probar todos los casos de borde.

### Verificar la Sincronización de Datos
Se verificó que los cambios realizados en el tablero Kanban se reflejan en tiempo real para otros usuarios que estén viendo el mismo tablero.

*   **Estado:** La sincronización funciona, pero se podría optimizar utilizando WebSockets en una futura iteración para mejorar la eficiencia.

### Entregables
- **Reporte de Pruebas:** Documento informal con los resultados de las pruebas manuales.
- **Correcciones Implementadas:** Las correcciones se encuentran en el historial de commits.
