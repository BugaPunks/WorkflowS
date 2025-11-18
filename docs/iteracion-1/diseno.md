# Iteración 1: Gestión de Equipos y Roles

## Diseño

### Mockups de la Interfaz
Se diseñaron prototipos de baja fidelidad para las siguientes vistas:
- **Vista de Gestión de Proyectos:** Una tabla que lista los proyectos existentes, con opciones para crear, editar y eliminar.
- **Vista de Gestión de Equipos:** Una interfaz para asignar estudiantes a un proyecto y asignarles roles de Scrum (Scrum Master, Product Owner, Team Developer).

*Nota: Los mockups se encuentran en una herramienta externa (Figma) y no se incluyen en este repositorio.*

### Diagramas UML
Se crearon los siguientes diagramas UML para modelar la arquitectura del sistema:

- **Diagrama de Clases:**
  ```mermaid
  classDiagram
    class Usuario {
      +id: string
      +nombre: string
      +email: string
      +rolPlataforma: RolPlataforma
    }

    class Proyecto {
      +id: string
      +nombre: string
      +fechaInicio: Date
      +fechaFin: Date
    }

    class RolProyecto {
      +id: string
      +rolScrum: RolScrum
    }

    Usuario "1" -- "*" RolProyecto
    Proyecto "1" -- "*" RolProyecto
  ```
  *Nota: Este diagrama simplificado muestra las relaciones principales entre usuarios, proyectos y sus roles.*

- **Diagrama de Casos de Uso:**
  ![Diagrama de Casos de Uso](https://i.imgur.com/3U2Y5lS.png)
  *Nota: El diagrama ilustra las interacciones clave del docente y el estudiante con el sistema de gestión de equipos.*

### Arquitectura de la Base de Datos
El modelo de datos se diseñó utilizando Prisma. A continuación se muestra un snippet relevante del esquema:

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  rolPlataforma Role      @default(ESTUDIANTE)
  proyectos     Project[] @relation("MiembrosProyecto")
}

model Project {
  id          String   @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  miembros    User[]   @relation("MiembrosProyecto")
}

enum Role {
  ADMIN
  DOCENTE
  ESTUDIANTE
}
```
*Nota: Este es un extracto del esquema de la base de datos. La implementación completa incluye más modelos y relaciones.*

### Entregables
- **Prototipos de Interfaz:** Enlace a los diseños en Figma.
- **Diagramas UML:** Documentos con los diagramas de clases y casos de uso.
- **Modelo de Datos:** Archivo `schema.prisma` con el diseño de la base de datos.
