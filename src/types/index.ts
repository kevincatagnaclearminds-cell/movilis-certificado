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
  role?: 'admin' | 'user' | 'issuer';
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
  // Información del usuario propietario (para vista admin)
  recipientName?: string;
  recipientEmail?: string;
  recipientCedula?: string;
  // Usuarios asignados (para relación muchos-a-muchos)
  assignedUsers?: Array<{
    id: string;
    _id: string;
    name: string;
    email?: string;
    cedula?: string;
  }>;
  usuariosAsignados?: Array<{
    id: string;
    _id: string;
    name: string;
    email?: string;
    cedula?: string;
  }>;
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

