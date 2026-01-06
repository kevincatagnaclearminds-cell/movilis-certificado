// ============================================
// CONSTANTES DE LA APLICACIÓN
// ============================================

/**
 * Configuración de la API
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Debug: Ver qué URL se está usando (solo en desarrollo o si no está configurada)
if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
  console.log('🔌 [API Config] VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('🔌 [API Config] BASE_URL final:', BASE_URL);
}

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
    },
    CERTIFICADOS: {
      LIST: '/certificados',
      DOWNLOAD: '/certificados/download',
      VERIFY: '/certificados/verify',
    },
    USERS: {
      PROFILE: '/users/profile',
    },
  },
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CERTIFICADOS: '/certificados',
  CERTIFICADO_DETALLE: '/certificados/:id',
  CREAR_CERTIFICADO: '/certificados/crear',
  CREAR_CERTIFICADO_RAPIDO: '/certificados/crear-rapido',
  CREAR_USUARIO: '/usuarios/crear',
} as const;

/**
 * Mensajes de la aplicación
 */
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_ERROR: 'Error al iniciar sesión. Verifica tu cédula.',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  },
  CERTIFICADOS: {
    DOWNLOAD_SUCCESS: 'Certificado descargado correctamente',
    DOWNLOAD_ERROR: 'Error al descargar el certificado',
    NOT_FOUND: 'No se encontraron certificados',
    LOADING: 'Cargando certificados...',
  },
  ERRORS: {
    GENERIC: 'Ha ocurrido un error. Intenta nuevamente.',
    NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
    SERVER: 'Error del servidor. Intenta más tarde.',
  },
} as const;

/**
 * Configuración de certificados
 */
export const CERTIFICADO_CONFIG = {
  TIPOS: {
    laboral: { label: 'Laboral', color: '#3B82F6', icon: 'Briefcase' },
    ingresos: { label: 'Ingresos', color: '#10B981', icon: 'DollarSign' },
    capacitacion: { label: 'Capacitación', color: '#8B5CF6', icon: 'GraduationCap' },
    participacion: { label: 'Participación', color: '#F59E0B', icon: 'Award' },
    competencia: { label: 'Competencia', color: '#EF4444', icon: 'Trophy' },
    otro: { label: 'Otro', color: '#6B7280', icon: 'FileText' },
  },
  ESTADOS: {
    vigente: { label: 'Vigente', color: '#10B981' },
    vencido: { label: 'Vencido', color: '#EF4444' },
    revocado: { label: 'Revocado', color: '#6B7280' },
    pendiente: { label: 'Pendiente', color: '#F59E0B' },
  },
} as const;

/**
 * Validaciones
 */
export const VALIDATIONS = {
  CEDULA: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12,
    PATTERN: /^[0-9]+$/,
    MESSAGE: 'La cédula debe contener solo números (6-12 dígitos)',
  },
} as const;

