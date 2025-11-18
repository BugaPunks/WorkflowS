# Iteración 4: Evaluación y Calificación

## Diseño

### Diseño de la Interfaz de Evaluación
Se diseñó una interfaz donde los docentes pueden:
- Crear rúbricas de evaluación con criterios y ponderaciones.
- Evaluar los entregables de los estudiantes utilizando las rúbricas.
- Ver un resumen de las calificaciones de cada estudiante.

*Nota: Los prototipos se encuentran en Figma.*

### Modelado del Sistema de Calificación
El sistema de calificación se modeló con las siguientes entidades:

```prisma
// schema.prisma

model Evaluation {
  id          String   @id @default(cuid())
  criteria    Json
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  grades      Grade[]
}

model Grade {
  id          String     @id @default(cuid())
  score       Float
  feedback    String?
  evaluationId String
  evaluation  Evaluation @relation(fields: [evaluationId], references: [id])
  studentId   String
  student     User       @relation(fields: [studentId], references: [id])
}
```
*Nota: Se utilizó un campo `Json` para almacenar los criterios de evaluación, lo que proporciona flexibilidad.*

### Diseño de Formularios de Retroalimentación
Los formularios de retroalimentación se diseñaron para ser simples y directos, con un campo de texto para comentarios generales y la opción de añadir comentarios específicos para cada criterio de evaluación.

### Entregables
- **Prototipos de Interfaz:** Enlace a los diseños en Figma.
- **Esquema de Métricas:** Documento que define las métricas de evaluación y cómo se calculan.
