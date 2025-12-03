# Plantillas de Certificados PDF

Esta carpeta contiene las plantillas de PDF para los certificados.

## Cómo usar una plantilla PDF base

Si tienes una plantilla PDF base (por ejemplo, `certificado-template.pdf`), puedes:

1. Colocar el archivo PDF en esta carpeta: `src/features/certificados/templates/certificado-template.pdf`

2. Modificar el archivo `src/features/certificados/utils/pdfGenerator.ts` para cargar y editar la plantilla:

```typescript
import templateBase from '../templates/certificado-template.pdf';

export async function generateCertificadoPDF(
  certificado: Certificado,
  user: User
): Promise<Uint8Array> {
  // Cargar la plantilla PDF base
  const existingPdfBytes = await fetch(templateBase).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  // Obtener la primera página
  const pages = pdfDoc.getPages();
  const page = pages[0];
  
  // Editar los campos de la plantilla
  // Ejemplo: reemplazar texto en campos específicos
  // page.drawText(user.nombreCompleto, { x: 100, y: 500, size: 14 });
  // page.drawText(user.cedula, { x: 100, y: 480, size: 12 });
  
  // Generar el PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
```

## Plantilla programática

Actualmente, la plantilla se genera programáticamente en `pdfGenerator.ts`. Puedes modificar ese archivo para personalizar el diseño del PDF.

## Datos disponibles

El generador de PDF recibe:
- `certificado`: Información del certificado (título, descripción, fechas, código, etc.)
- `user`: Información del usuario (nombre completo, cédula, apellidos, email, etc.)

