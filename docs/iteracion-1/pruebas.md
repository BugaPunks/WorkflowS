# Iteración 1: Gestión de Equipos y Roles

## Pruebas

### Creación de Pruebas Unitarias
Se escribieron pruebas unitarias utilizando Jest para validar la lógica de negocio relacionada con la asignación de roles y permisos.

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

### Pruebas de Integración
Se realizaron pruebas de integración para asegurar que los componentes del frontend se comunican correctamente con la API y que los datos se persisten en la base de datos.

*   **Estado:** Realizadas manualmente. La automatización de estas pruebas está pendiente.

### Validación de la Creación y Gestión de Equipos
Se validó manualmente el flujo completo de creación de un proyecto, asignación de estudiantes y asignación de roles.

*   **Resultados:** Se identificaron y corrigieron errores menores en la interfaz de usuario.

### Entregables
- **Reporte de Pruebas:** Los resultados de las pruebas unitarias se generan automáticamente al ejecutar `npm test`.
- **Correcciones Implementadas:** Las correcciones de los errores encontrados se encuentran en el historial de commits de esta iteración.
