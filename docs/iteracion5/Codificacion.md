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

#### Código de Ejemplo

```typescript
// workflows/src/app/components/RoleBasedDashboard.tsx

'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardScrumMaster from "./DashboardScrumMaster";
import DashboardProductOwner from "./DashboardProductOwner";
import DashboardTeamDeveloper from "./DashboardTeamDeveloper";

type ScrumRole = 'SCRUM_MASTER' | 'PRODUCT_OWNER' | 'TEAM_DEVELOPER';

export default function RoleBasedDashboard() {
  const { data: session } = useSession();
  const params = useParams();
  const [scrumRole, setScrumRole] = useState<ScrumRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.projectId as string;

  useEffect(() => {
    fetchScrumRole();
  }, [projectId, session]);

  const fetchScrumRole = async () => {
    if (!session?.user?.id || !projectId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/scrum-role`);
      if (res.ok) {
        const data = await res.json();
        setScrumRole(data.scrumRole);
      } else if (res.status === 404) {
        setError('No eres miembro de este proyecto');
      } else {
        setError('Error al cargar el rol del proyecto');
      }
    } catch (error) {
      console.error('Error fetching scrum role:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!scrumRole) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium">Rol no asignado</h3>
          <p className="text-yellow-600">
            No tienes un rol Scrum asignado en este proyecto. Contacta al administrador del proyecto.
          </p>
        </div>
      </div>
    );
  }

  // Renderizar el dashboard según el rol Scrum
  switch (scrumRole) {
    case 'SCRUM_MASTER':
      return <DashboardScrumMaster projectId={projectId} />;
    case 'PRODUCT_OWNER':
      return <DashboardProductOwner projectId={projectId} />;
    case 'TEAM_DEVELOPER':
      return <DashboardTeamDeveloper projectId={projectId} />;
    default:
      return (
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-800 font-medium">Rol desconocido</h3>
            <p className="text-gray-600">
              Tu rol ({scrumRole}) no tiene un dashboard configurado.
            </p>
          </div>
        </div>
      );
  }
}
```
