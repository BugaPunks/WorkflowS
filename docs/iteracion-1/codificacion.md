# Iteración 1: Gestión de Equipos y Roles

## Codificación

### Programación de la Creación y Gestión de Equipos
Se implementaron los endpoints de la API y los componentes de la interfaz de usuario para permitir a los docentes crear proyectos y asignar estudiantes.

**Snippet de Código Relevante:**
A continuación, se muestra la función para crear un nuevo proyecto.

*   **Título:** `createProject`
*   **Nota:** Esta función de servidor (Server Action en Next.js) recibe los datos del proyecto desde un formulario y utiliza Prisma para crear un nuevo registro en la base de datos.

```typescript
// src/actions/project-actions.ts

export async function createProject(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    startDate: new Date(formData.get('startDate') as string),
    endDate: new Date(formData.get('endDate') as string),
  };

  await prisma.project.create({ data });
  // ...
}
```

### Implementación de la Asignación de Roles
Se desarrolló la funcionalidad para que un docente pueda asignar roles de Scrum (Product Owner, Scrum Master, Team Developer) a los estudiantes dentro de un proyecto.

*   **Estado:** Implementado.

### Desarrollo de la Validación de Permisos
Se implementó un sistema de validación de permisos basado en roles. Solo los usuarios con el rol de `DOCENTE` pueden crear proyectos y asignar roles.

*   **Estado:** Implementado a nivel de API. La validación en el frontend está pendiente.

### Entregables
- **Código Fuente Comentado:** El código fuente se encuentra en el directorio `src/` y sigue las convenciones de JSDoc para la documentación.
- **Módulo de Equipos Funcional:** La funcionalidad básica de creación de proyectos y asignación de miembros está operativa.
