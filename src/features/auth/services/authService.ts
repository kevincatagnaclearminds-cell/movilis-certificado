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
  name: string;
  email: string;
  password: string;
}

interface BackendAuthResponse {
  user?: {
    id?: string;
    _id?: string;
    name?: string;
    nombre?: string;
    nombreCompleto?: string;
    email?: string;
    correo?: string;
    cedula?: string;
  };
  // El backend puede devolver el usuario directamente sin envolverlo en "user"
  id?: string;
  _id?: string;
  name?: string;
  nombre?: string;
  nombreCompleto?: string;
  email?: string;
  correo?: string;
  cedula?: string;
  token?: string;
  message?: string;
}

export const authService = {
  /**
   * Registra un nuevo usuario en el backend
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('📝 [Auth] Iniciando registro de usuario...');
    console.log('📝 [Auth] Datos:', { name: data.name, email: data.email });

    try {
      const response = await apiClient.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        console.log('✅ [Auth] Registro exitoso');
        
        const backendUser = response.data.user;
        const user: User = {
          cedula: backendUser?.id || '',
          nombreCompleto: backendUser?.name || data.name,
          primerNombre: (backendUser?.name || data.name).split(' ')[0],
          segundoNombre: (backendUser?.name || data.name).split(' ')[1] || '',
          primerApellido: (backendUser?.name || data.name).split(' ')[2] || '',
          segundoApellido: (backendUser?.name || data.name).split(' ')[3] || '',
          email: backendUser?.email || data.email,
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
   * Inicia sesión con cédula (Backend real)
   */
  async loginWithCedula(cedula: string): Promise<AuthResponse> {
    console.log('🔐 [Auth] Iniciando login con cédula:', cedula);

    try {
      const response = await apiClient.post<BackendAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        { cedula }
      );

      // Mostrar exactamente qué devuelve el backend
      console.log('📦 [Auth] Respuesta completa del backend:', response);
      console.log('📦 [Auth] response.data:', response.data);

      if (response.success && response.data) {
        console.log('✅ [Auth] Login exitoso');

        const data = response.data;
        // El usuario puede venir en data.user o directamente en data
        const backendUser = data.user || data;
        
        console.log('👤 [Auth] Datos del usuario del backend:', backendUser);

        // Extraer nombre (probar varios campos posibles)
        const nombre = backendUser?.name || backendUser?.nombre || backendUser?.nombreCompleto || '';
        // Extraer email (probar varios campos posibles)
        const email = backendUser?.email || backendUser?.correo || '';
        // Extraer cédula (probar varios campos posibles)
        const userCedula = backendUser?.cedula || backendUser?.id || backendUser?._id || cedula;

        console.log('📝 [Auth] Nombre extraído:', nombre);
        console.log('📝 [Auth] Email extraído:', email);
        console.log('📝 [Auth] Cédula extraída:', userCedula);

        const user: User = {
          cedula: String(userCedula),
          nombreCompleto: nombre,
          primerNombre: nombre.split(' ')[0] || '',
          segundoNombre: nombre.split(' ')[1] || '',
          primerApellido: nombre.split(' ')[2] || '',
          segundoApellido: nombre.split(' ')[3] || '',
          email: email,
        };

        console.log('👤 [Auth] Usuario final mapeado:', user);

        // Guardar token si existe
        if (data.token) {
          localStorage.setItem('movilis_token', data.token);
        }

        return {
          success: true,
          user,
          token: data.token,
          message: 'Inicio de sesión exitoso',
        };
      }

      return {
        success: false,
        message: response.error || 'Cédula no encontrada',
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
    
    if (AUTH_CONFIG.demoMode) {
      // Modo demo: usar datos de prueba
      console.log('🔐 [Auth] Modo demo - buscando usuario...');
      await delay(1000);
      const user = DEMO_USERS[cleanedCedula] || null;
      
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
    }
    
    // Modo backend: enviar solo la cédula
    console.log('🔐 [Auth] Conectando al backend con cédula:', cleanedCedula);
    return await this.loginWithCedula(cleanedCedula);
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

