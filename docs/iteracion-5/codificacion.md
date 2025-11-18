# Iteración 5: Dashboard y Métricas

## Codificación

### Implementación del Dashboard con Métricas
Se desarrolló el Dashboard del docente utilizando componentes de React y la librería de gráficos `Recharts`.

**Snippet de Código Relevante:**
A continuación, se muestra una consulta de Prisma para obtener las métricas de contribución individual.

*   **Título:** `getUserContributions`
*   **Nota:** Esta función cuenta el número de tareas completadas por cada usuario en un proyecto.

```typescript
// src/queries/metrics.ts

async function getUserContributions(projectId: string) {
  return await prisma.task.groupBy({
    by: ['assigneeId'],
    where: {
      story: {
        sprint: {
          projectId,
        },
      },
      status: 'COMPLETADO',
    },
    _count: {
      id: true,
    },
  });
}
```

### Desarrollo del Sistema de Reportes
Se integró la librería `jsPDF` para generar los reportes en formato PDF.

*   **Estado:** Implementado, pero con funcionalidades básicas. Se planea añadir más opciones de personalización en el futuro.

### Integración con Módulos Existentes
El Dashboard se integró con los módulos de proyectos, Sprints y tareas para obtener los datos necesarios.

*   **Estado:** Implementado.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en el directorio `src/`.
- **Dashboard Funcional:** El Dashboard del docente está operativo y muestra las métricas clave.
