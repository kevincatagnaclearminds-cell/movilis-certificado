import type { AuthResponse, User } from '@/types';
import { delay } from '@/utils';
import { apiClient, API_CONFIG } from '@/config';

/**
 * Servicio de autenticación
 * Conecta con el backend en http://localhost:3000/api
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const AUTH_CONFIG = {
  // Modo demo (true = usa datos de prueba, false = usa API real del backend)
  demoMode: false, // Cambiado a false para usar el backend real
};

// Datos de demostración (solo se usan cuando demoMode = true)
const DEMO_USERS: Record<string, User> = {
  '1234567890': {
    cedula: '1234567890',
    nombreCompleto: 'Juan Carlos Pérez Rodríguez',
    primerNombre: 'Juan',
    segundoNombre: 'Carlos',
    primerApellido: 'Pérez',
    segundoApellido: 'Rodríguez',
    email: 'juan.perez@email.com',
  },
  '9876543210': {
    cedula: '9876543210',
    nombreCompleto: 'María Fernanda López García',
    primerNombre: 'María',
    segundoNombre: 'Fernanda',
    primerApellido: 'López',
    segundoApellido: 'García',
    email: 'maria.lopez@email.com',
  },
  '1122334455': {
    cedula: '1122334455',
    nombreCompleto: 'Carlos Andrés Martínez Silva',
    primerNombre: 'Carlos',
    segundoNombre: 'Andrés',
    primerApellido: 'Martínez',
    segundoApellido: 'Silva',
    email: 'carlos.martinez@email.com',
  },
  '1728963594': {
    cedula: '1728963594',
    nombreCompleto: 'Jeremy Llumiquinga',
    primerNombre: 'Jeremy',
    segundoNombre: '',
    primerApellido: 'Llumiquinga',
    segundoApellido: '',
    email: 'jeremy.llumiquinga@email.com',
  },
};

// ============================================
// INTERFACES PARA EL BACKEND
// ============================================
interface RegisterData {
  cedula: string;
  name: string;
  email?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface BackendAuthResponse {
  user?: {
    id?: string;
    cedula?: string;
    name: string;
    email?: string;
    role?: string;
  };
  token?: string;
  message?: string;
}

export const authService = {
  /**
   * Registra un nuevo usuario en el backend
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('📝 [Auth] Iniciando registro de usuario...');
    console.log('📝 [Auth] Datos:', { cedula: data.cedula, name: data.name, email: data.email });

    try {
      const response = await apiClient.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        {
          cedula: data.cedula,
          name: data.name,
          email: data.email
        }
      );

      if (response.success && response.data) {
        console.log('✅ [Auth] Registro exitoso');
        
        const backendUser = response.data.user;
        const user: User = {
          cedula: backendUser?.cedula || data.cedula,
          nombreCompleto: backendUser?.name || data.name,
          primerNombre: (backendUser?.name || data.name).split(' ')[0],
          segundoNombre: (backendUser?.name || data.name).split(' ')[1] || '',
          primerApellido: (backendUser?.name || data.name).split(' ')[2] || '',
          segundoApellido: (backendUser?.name || data.name).split(' ')[3] || '',
          email: backendUser?.email || data.email || '',
          role: (backendUser?.role as 'admin' | 'user' | 'issuer' | undefined) || undefined,
        };

        // Guardar token si existe
        if (response.data.token) {
          localStorage.setItem('movilis_token', response.data.token);
        }

        return {
          success: true,
          user,
          token: response.data.token,
          message: 'Registro exitoso',
        };
      }

      return {
        success: false,
        message: response.error || 'Error al registrar usuario',
      };
    } catch (error) {
      console.error('❌ [Auth] Error en registro:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  },

  /**
   * Inicia sesión con email y password (Backend real)
   */
  async loginWithEmail(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 [Auth] Iniciando login con email...');

    try {
      const response = await apiClient.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data
      );

      if (response.success && response.data) {
        console.log('✅ [Auth] Login exitoso');

        const backendUser = response.data.user;
        const user: User = {
          cedula: backendUser?.cedula || backendUser?.id || '',
          nombreCompleto: backendUser?.name || '',
          primerNombre: (backendUser?.name || '').split(' ')[0],
          segundoNombre: (backendUser?.name || '').split(' ')[1] || '',
          primerApellido: (backendUser?.name || '').split(' ')[2] || '',
          segundoApellido: (backendUser?.name || '').split(' ')[3] || '',
          email: backendUser?.email || data.email,
          role: (backendUser?.role as 'admin' | 'user' | 'issuer' | undefined) || undefined,
        };

        // Guardar token si existe
        if (response.data.token) {
          localStorage.setItem('movilis_token', response.data.token);
        }

        return {
          success: true,
          user,
          token: response.data.token,
          message: 'Inicio de sesión exitoso',
        };
      }

      return {
        success: false,
        message: response.error || 'Credenciales inválidas',
      };
    } catch (error) {
      console.error('❌ [Auth] Error en login:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  },

  /**
   * Inicia sesión con número de cédula (modo demo o API real)
   */
  async login(cedula: string): Promise<AuthResponse> {
    const cleanedCedula = cedula.replace(/[.\s]/g, '');
    
    let user: User | null = null;

    if (AUTH_CONFIG.demoMode) {
      // Modo demo: usar datos de prueba
      console.log('🔐 [Auth] Modo demo - buscando usuario...');
      await delay(1000);
      user = DEMO_USERS[cleanedCedula] || null;
    } else {
      // Modo backend: enviar cédula directamente al backend
      console.log('🔐 [Auth] Conectando al backend con cédula...');
      try {
        const response = await apiClient.post<BackendAuthResponse>(
          API_CONFIG.ENDPOINTS.AUTH.LOGIN,
          { cedula: cleanedCedula }
        );

        if (response.success && response.data) {
          console.log('✅ [Auth] Login exitoso con backend');
          
          // El backend devuelve: { success: true, data: { user: {...}, token: "..." } }
          // El apiClient envuelve esto en: { success: true, data: { success: true, data: {...} } }
          const backendResponse = response.data as any;
          const backendData = backendResponse.data || backendResponse;
          const backendUser = backendData.user;
          
          if (!backendUser) {
            console.error('❌ [Auth] No se encontró el usuario en la respuesta:', backendResponse);
            throw new Error('Usuario no encontrado en la respuesta del servidor');
          }

          user = {
            cedula: backendUser.cedula || cleanedCedula,
            nombreCompleto: backendUser.name || backendUser.nombreCompleto || '',
            primerNombre: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[0],
            segundoNombre: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[1] || '',
            primerApellido: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[2] || '',
            segundoApellido: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[3] || '',
            email: backendUser.email,
            role: backendUser.role,
          };
          
          const userData: User = {
            cedula: backendUser.cedula || cleanedCedula,
            nombreCompleto: backendUser.name || backendUser.nombreCompleto || '',
            primerNombre: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[0],
            segundoNombre: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[1] || '',
            primerApellido: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[2] || '',
            segundoApellido: (backendUser.name || backendUser.nombreCompleto || '').split(' ')[3] || '',
            email: backendUser.email || '',
            role: backendUser.role,
          };

          // Guardar token si existe
          const token = backendData.token;
          if (token) {
            localStorage.setItem('movilis_token', token);
          }

          return {
            success: true,
            user: userData,
            token: token,
            message: 'Inicio de sesión exitoso',
          };
        }
      } catch (error) {
        console.error('❌ [Auth] Error en login con backend:', error);
      }
      
      // Si falla, buscar en usuarios demo como fallback
      user = DEMO_USERS[cleanedCedula] || null;
    }

    if (user) {
      return {
        success: true,
        user,
        token: `token_${Date.now()}`,
        message: 'Inicio de sesión exitoso',
      };
    }

    return {
      success: false,
      message: 'Cédula no encontrada',
    };
  },

  /**
   * Cierra la sesión actual
   */
  async logout(): Promise<void> {
    console.log('🚪 [Auth] Cerrando sesión...');
    localStorage.removeItem('movilis_token');
    localStorage.removeItem('movilis_user');
    await delay(300);
    console.log('✅ [Auth] Sesión cerrada');
  },

  /**
   * Verifica si el token es válido
   */
  async verifyToken(token: string): Promise<boolean> {
    await delay(200);
    return token.startsWith('token_') || token.length > 10;
  },

  /**
   * Prueba la conexión al backend
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 [Auth] Probando conexión al backend...');
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      const connected = response.ok;
      console.log(connected ? '✅ [Auth] Backend conectado' : '❌ [Auth] Backend no disponible');
      return connected;
    } catch {
      console.log('❌ [Auth] Error de conexión al backend');
      return false;
    }
  },
};

