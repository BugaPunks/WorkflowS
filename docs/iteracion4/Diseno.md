# Diseño de la Iteración 4: Evaluación y Calificación

## Modelo de Datos

El modelo de datos para el sistema de evaluación y calificación se define en el archivo `prisma/schema.prisma`. A continuación se detalla el modelo relevante para esta iteración.

### Modelos

#### Evaluation

Representa una evaluación realizada a un estudiante en un proyecto y sprint específicos.

```prisma
model Evaluation {
  id          String   @id @default(cuid())
  score       Float
  feedback    String?
  project     Project  @relation(fields: [projectId], references: [id])
  projectId   String
  sprint      Sprint   @relation(fields: [sprintId], references: [id])
  sprintId    String
  student     User     @relation("EvaluatedUser", fields: [studentId], references: [id])
  studentId   String
  evaluator   User     @relation("AuthoredEvaluations", fields: [evaluatorId], references: [id])
  evaluatorId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
