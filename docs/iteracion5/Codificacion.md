# Codificación de la Iteración 5: Dashboard y Métricas

## Dashboard Basado in Roles

El dashboard se renderiza de forma dinámica según el rol de Scrum del usuario en el proyecto.

### `RoleBasedDashboard.tsx`

Este componente es el punto de entrada para el dashboard. Obtiene el rol de Scrum del usuario y renderiza el dashboard correspondiente.

- **Propósito:** Mostrar un dashboard personalizado según el rol del usuario.
- **Componentes Anidados:**
  - `DashboardScrumMaster`: Dashboard para el rol de Scrum Master.
  - `DashboardProductOwner`: Dashboard para el rol de Product Owner.
  - `DashboardTeamDeveloper`: Dashboard para el rol de Team Developer.

#### Renderizado del Dashboard según el Rol
Este fragmento de código muestra cómo, una vez obtenido el rol de Scrum del usuario, se utiliza una declaración `switch` para renderizar el componente de dashboard adecuado.

```typescript
// workflows/src/app/components/RoleBasedDashboard.tsx
switch (scrumRole) {
  case 'SCRUM_MASTER':
    return <DashboardScrumMaster projectId={projectId} />;
  case 'PRODUCT_OWNER':
    return <DashboardProductOwner projectId={projectId} />;
  case 'TEAM_DEVELOPER':
    return <DashboardTeamDeveloper projectId={projectId} />;
  default:
    return <div>Rol desconocido</div>;
}
```
