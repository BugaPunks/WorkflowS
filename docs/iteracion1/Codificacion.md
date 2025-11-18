# Codificación de la Iteración 1: Gestión de Equipos y Roles

## Creación de Usuarios

La creación de usuarios se gestiona a través de una ruta de API que recibe una solicitud POST.

### `POST /api/users`

Esta función maneja la creación de un nuevo usuario en la base de datos.

- **Propósito:** Registrar un nuevo usuario en el sistema.
- **Parámetros:**
  - `req`: El objeto de solicitud, que contiene en el cuerpo:
    - `email` (string): El correo electrónico del usuario.
    - `name` (string): El nombre del usuario.
    - `password` (string): La contraseña del usuario.
    - `role` (RoleName): El rol del usuario en la plataforma.
- **Retorno:** Un objeto `NextResponse` con el usuario creado en formato JSON o un mensaje de error.

#### Creación de Usuario en la Base de Datos
Este fragmento de código muestra cómo, después de validar los datos de entrada y hashear la contraseña, se crea un nuevo registro de usuario en la base de datos utilizando Prisma.

```typescript
// workflows/src/app/api/users/route.ts
const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: {
    email,
    name,
    password: hashedPassword,
    role,
  },
});

return NextResponse.json(user);
```
