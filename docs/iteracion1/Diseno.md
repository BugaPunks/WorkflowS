# Diseño de la Iteración 1: Gestión de Equipos y Roles

## Modelo de Datos

El modelo de datos para la gestión de equipos y roles se define en el archivo `prisma/schema.prisma`. A continuación se detallan los modelos y enums relevantes para esta iteración.

### Enums

#### RoleName

Define los roles a nivel de plataforma para los usuarios.

```prisma
enum RoleName {
  ADMIN
  DOCENTE
  ESTUDIANTE
}
```

#### ScrumRole

Define los roles de Scrum que un usuario puede tener dentro de un proyecto.

```prisma
enum ScrumRole {
  SCRUM_MASTER
  PRODUCT_OWNER
  TEAM_DEVELOPER
}
```

### Modelos

#### User

Representa a un usuario en la plataforma.

```prisma
model User {
  id                  String        @id @default(cuid())
  email               String        @unique
  name                String?
  password            String
  role                RoleName      @default(ESTUDIANTE)
  projects            ProjectUser[]
  // ... otros campos
}
```

#### Project

Representa un proyecto académico.

```prisma
model Project {
  id           String       @id @default(cuid())
  name         String
  description  String?
  startDate    DateTime
  endDate      DateTime
  users        ProjectUser[]
  // ... otros campos
}
```

#### ProjectUser

Es una tabla intermedia que relaciona a los usuarios con los proyectos y les asigna un rol de Scrum.

```prisma
model ProjectUser {
  id        String    @id @default(cuid())
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  project   Project   @relation(fields: [projectId], references: [id])
  projectId String
  role      ScrumRole
  @@unique([userId, projectId])
}
```
