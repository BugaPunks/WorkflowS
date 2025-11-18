# Diseño de la Iteración 5: Dashboard y Métricas

## Modelo de Datos

El modelo de datos para el historial de exportaciones se define en el archivo `prisma/schema.prisma`. A continuación se detalla el modelo relevante para esta iteración.

### Enums

#### ExportFormat

Define los posibles formatos de exportación.

```prisma
enum ExportFormat {
  JSON
  CSV
  PDF
  EXCEL
}
```

#### ExportType

Define los posibles tipos de exportación.

```prisma
enum ExportType {
  PROJECT
  REPORTS
  EVALUATIONS
  DASHBOARD
}
```

### Modelos

#### ExportHistory

Representa un registro de una exportación de datos.

```prisma
model ExportHistory {
  id          String       @id @default(cuid())
  user        User         @relation(fields: [userId], references: [id])
  userId      String
  project     Project?     @relation(fields: [projectId], references: [id])
  projectId   String?
  type        ExportType
  format      ExportFormat
  fileName    String
  fileSize    Int?         // Size in bytes
  status      String       @default("pending") // pending, processing, completed, failed
  downloadUrl String?
  expiresAt   DateTime?
  createdAt   DateTime     @default(now())
  completedAt DateTime?
  error       String?
}
```

## Bibliotecas de Gráficos

La visualización de métricas en el dashboard se realiza utilizando la biblioteca `recharts`, la cual está definida como una dependencia en el archivo `package.json`.
