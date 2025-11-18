# Iteración 1: Gestión de Equipos y Roles

## Pruebas

### Creación de Pruebas Unitarias y de Integración
Se escribieron pruebas unitarias y de integración utilizando Jest para validar la lógica de negocio y los endpoints de la API relacionados con la gestión de usuarios, proyectos y roles.

**Tests Relevantes:**
A continuación se detallan los archivos de prueba correspondientes a esta iteración:

*   **`tests/api/projects.test.ts`**: Valida la creación, obtención, actualización y eliminación de proyectos.
*   **`tests/api/projects-users.test.ts`**: Prueba la adición y eliminación de usuarios en un proyecto.
*   **`tests/api/users.test.ts`**: Valida el CRUD de usuarios.
*   **`tests/api/users-list.test.ts`**: Prueba la obtención de la lista de usuarios.
*   **`tests/api/users-role.test.ts`**: Valida la asignación de roles de plataforma a los usuarios.
*   **`tests/api/projects-scrum-role.test.ts`**: Prueba la asignación de roles de Scrum a los usuarios dentro de un proyecto.

**Snippet de Prueba Relevante:**
A continuación, se muestra un caso de prueba para verificar que un usuario con el rol de `ESTUDIANTE` no puede crear un proyecto.

*   **Título:** `test_student_cannot_create_project`
*   **Nota:** Esta prueba simula una llamada a la función `createProject` con un usuario no autorizado y espera que se lance un error.

```typescript
// tests/project.test.ts

describe('Project Actions', () => {
  it('should not allow a student to create a project', async () => {
    const session = { user: { role: 'ESTUDIANTE' } };
    // Mock de la sesión y de la base de datos
    // ...

    await expect(createProject(formData, session)).rejects.toThrow();
  });
});
```

### Validación Manual
Se validó manualmente el flujo completo de creación de un proyecto, asignación de estudiantes y asignación de roles a través de la interfaz de usuario.

*   **Resultados:** Se identificaron y corrigieron errores menores en la interfaz de usuario.

### Entregables
- **Reporte de Pruebas:** Los resultados de las pruebas se generan automáticamente al ejecutar `npm test`.
- **Correcciones Implementadas:** Las correcciones de los errores encontrados se encuentran en el historial de commits de esta iteración.
