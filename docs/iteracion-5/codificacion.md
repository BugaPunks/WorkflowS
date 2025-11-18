# Iteración 5: Dashboard y Métricas

## Codificación

### Implementación del Dashboard y el Sistema de Métricas
Se desarrollaron los componentes del Dashboard para los diferentes roles de usuario y los endpoints de la API para obtener y mostrar las métricas del proyecto.

**Archivos Relevantes:**
A continuación se detallan los archivos de código fuente correspondientes a esta iteración:

*   **`src/app/components/UserDashboard.tsx`**: Componente principal del dashboard del usuario.
*   **`src/app/components/RoleBasedDashboard.tsx`**: Componente que renderiza el dashboard específico según el rol del usuario en el proyecto.
*   **`src/app/components/DashboardScrumMaster.tsx`**: Componente específico para el dashboard del Scrum Master.
*   **`src/app/api/projects/[projectId]/dashboard/route.ts`**: Endpoint principal de la API para obtener los datos del dashboard. *(Nota: El nombre y la estructura de los archivos pueden variar, estos son ejemplos representativos)*.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en los directorios `src/app/components` y `src/app/api`.
- **Dashboard Funcional:** El Dashboard está operativo y muestra métricas relevantes para cada rol.
