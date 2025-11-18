# Iteración 1: Gestión de Equipos y Roles

## Codificación

### Programación de la Creación y Gestión de Equipos y Roles
Se implementaron los endpoints de la API y los componentes de la interfaz de usuario para permitir a los docentes crear proyectos, asignar estudiantes y definir roles.

**Archivos de la API Relevantes:**
A continuación se detallan los archivos de la API correspondientes a esta iteración:

*   **`src/app/api/projects/route.ts`**: Gestiona la creación y obtención de proyectos.
*   **`src/app/api/projects/[projectId]/users/route.ts`**: Gestiona la asignación de usuarios a un proyecto.
*   **`src/app/api/users/route.ts`**: Gestiona el CRUD de usuarios.
*   **`src/app/api/users/[userId]/route.ts`**: Gestiona la obtención, actualización y eliminación de un usuario específico.
*   **`src/app/api/users/role/route.ts`**: Gestiona la asignación de roles de plataforma.
*   **`src/app/api/projects/[projectId]/scrum-role/route.ts`**: Gestiona la asignación de roles de Scrum dentro de un proyecto.

**Snippet de Código Relevante:**
A continuación, se muestra la función para crear un nuevo proyecto.

*   **Título:** `createProject` (dentro de `src/app/api/projects/route.ts`)
*   **Nota:** Esta función de servidor (manejador de ruta en Next.js) recibe los datos del proyecto desde una solicitud POST y utiliza Prisma para crear un nuevo registro en la base de datos.

```typescript
// src/app/api/projects/route.ts

export async function POST(request: Request) {
  const data = await request.json();
  const project = await prisma.project.create({
    data,
  });
  return NextResponse.json(project);
}
```

### Entregables
- **Código Fuente Comentado:** El código fuente se encuentra en el directorio `src/` y sigue las convenciones de JSDoc para la documentación.
- **Módulo de Equipos Funcional:** La funcionalidad básica de creación de proyectos y asignación de miembros está operativa.
