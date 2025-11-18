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

#### Código de Ejemplo

```typescript
// workflows/src/app/api/users/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Creates a new user
 *     description: Creates a new user with the provided email, name, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/RoleName'
 *     responses:
 *       '200':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request, email and password are required or user already exists
 *       '500':
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    if (!email || !password) {
      return new NextResponse("Email and password are required", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

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
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```
