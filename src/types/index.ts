// ============================================
// TIPOS GLOBALES DE LA APLICACIÓN
// ============================================

/**
 * Información del usuario autenticado
 */
export interface User {
  cedula: string;
  nombreCompleto: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email?: string;
  telefono?: string;
}

/**
 * Estado de un certificado
 */
export type CertificadoEstado = 'vigente' | 'vencido' | 'revocado' | 'pendiente';

/**
 * Tipo de certificado
 */
export type CertificadoTipo = 
  | 'laboral' 
  | 'ingresos' 
  | 'capacitacion' 
  | 'participacion' 
  | 'competencia'
  | 'otro';

/**
 * Información de un certificado
 */
export interface Certificado {
  id: string;
  tipo: CertificadoTipo;
  titulo: string;
  descripcion?: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  estado: CertificadoEstado;
  entidadEmisora: string;
  codigoVerificacion: string;
  urlDescarga?: string;
  firmado: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * Respuesta de certificados
 */
export interface CertificadosResponse {
  success: boolean;
  certificados: Certificado[];
  total: number;
  message?: string;
}

/**
 * Estado de carga de datos
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Props base para componentes
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

