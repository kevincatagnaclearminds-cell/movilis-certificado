import { PDFDocument, rgb } from 'pdf-lib';
import type { Certificado, User } from '@/types';
import templateBase from '../templates/certificado.pdf';

// Ruta a la fuente Alex Brush
// El archivo debe estar en: public/fonts/AlexBrush-Regular.ttf
const ALEX_BRUSH_FONT_URL = '/fonts/AlexBrush-Regular.ttf';

/**
 * Genera un PDF de certificado usando la plantilla base
 * Edita la plantilla con los datos del usuario y certificado
 * Utiliza la fuente Alex Brush para un diseño elegante
 */
export async function generateCertificadoPDF(
  _certificado: Certificado,
  user: User
): Promise<Uint8Array> {
  try {
    // Cargar la plantilla PDF base
    const templateResponse = await fetch(templateBase);
    if (!templateResponse.ok) {
      throw new Error(`No se pudo cargar la plantilla PDF: ${templateResponse.statusText}`);
    }
    const templateBytes = await templateResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    // Obtener la primera página de la plantilla
    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error('La plantilla PDF no contiene páginas');
    }
    const page = pages[0];
    
    // Obtener dimensiones de la página para centrar el texto
    const { width } = page.getSize();
    
    // Cargar la fuente personalizada Alex Brush
    // Si el archivo no está disponible, se usará una fuente estándar como fallback
    let alexBrushFont;
    try {
      const fontResponse = await fetch(ALEX_BRUSH_FONT_URL);
      if (fontResponse.ok) {
        const fontBytes = await fontResponse.arrayBuffer();
        alexBrushFont = await pdfDoc.embedFont(fontBytes);
      } else {
        throw new Error('Fuente no encontrada');
      }
    } catch (error) {
      console.warn('No se pudo cargar la fuente Alex Brush, usando fuente estándar:', error);
      // Fallback a fuente estándar si no se puede cargar Alex Brush
      const { StandardFonts } = await import('pdf-lib');
      alexBrushFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    // ============================================
    // CONFIGURACIÓN DE COORDENADAS Y FUENTE
    // ============================================
    // Coordenadas específicas según la plantilla PDF
    // El sistema de coordenadas: (0,0) está en la esquina inferior izquierda
    // Y aumenta hacia arriba en el PDF
    
    const fontSize = 50; // Tamaño de texto: 12 puntos
    
    // ============================================
    // NOMBRE COMPLETO DEL ESTUDIANTE
    // ============================================
    // Posición: Encima de la línea de puntitos, debajo de "OTORGADO A:"
    // El nombre debe estar centrado y sobre la línea punteada en la plantilla
    // Fuente: Alex Brush
    
    // Calcular el ancho del texto para centrarlo
    const textWidth = alexBrushFont.widthOfTextAtSize(user.nombreCompleto, fontSize);
    const centerX = width / 2;
    const textX = centerX - (textWidth / 2);
    
    // Posición Y: encima de la línea de puntitos, debajo de "OTORGADO A:"
    // IMPORTANTE: Ajusta este valor según tu plantilla
    // - La línea de puntitos en el PDF está aproximadamente en Y = ?
    // - El nombre debe estar justo encima de esa línea
    // - Valores más altos = más arriba, valores más bajos = más abajo
    // Ejemplo: si la línea está en Y=450, usa nombreY = 460-470 para estar encima
    const nombreY = 320;// AJUSTA ESTE VALOR según la posición de la línea de puntitos en tu PDF
    
    page.drawText(user.nombreCompleto, {
      x: textX, // Centrado horizontalmente
      y: nombreY, // Encima de la línea de puntitos
      size: fontSize,
      font: alexBrushFont,
      color: rgb(0, 0, 0),
    });
    
    // ============================================
    // FIN DE EDICIÓN DE CAMPOS
    // ============================================
    
    // Generar el PDF editado
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error al generar el certificado PDF:', error);
    throw new Error(`Error al generar el certificado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

