// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Formatea una cédula con puntos separadores
 */
export function formatCedula(cedula: string): string {
  return cedula.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Limpia una cédula (quita puntos y espacios)
 */
export function cleanCedula(cedula: string): string {
  return cedula.replace(/[.\s]/g, '');
}

/**
 * Valida si una cédula es válida
 */
export function isValidCedula(cedula: string): boolean {
  const cleaned = cleanCedula(cedula);
  return /^[0-9]{6,12}$/.test(cleaned);
}

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formatea una fecha corta
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Calcula días restantes hasta una fecha
 */
export function daysUntil(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Descarga un archivo desde una URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Simula un delay (útil para demos)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clasifica y une clases CSS
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

