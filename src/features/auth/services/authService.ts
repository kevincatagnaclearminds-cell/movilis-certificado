import type { AuthResponse, User } from '@/types';
import { delay } from '@/utils';

/**
 * Servicio de autenticación
 * Configuración para API real de Ecuador
 */

// ============================================
// CONFIGURACIÓN DE API
// Cambia estas variables según tu proveedor de API
// ============================================
const API_CONFIG = {
  // URL de tu API backend que consulta el Registro Civil
  // Ejemplo: 'https://tu-api.com/api/consultar-cedula'
  baseUrl: import.meta.env.VITE_API_URL || '',
  
  // API Key si tu proveedor lo requiere
  apiKey: import.meta.env.VITE_API_KEY || '',
  
  // Modo demo (true = usa datos de prueba, false = usa API real)
  demoMode: true,
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

/**
 * Consulta la API real del Registro Civil de Ecuador
 */
async function consultarCedulaReal(cedula: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/consultar-cedula`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({ cedula }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Adapta esto según la estructura de respuesta de tu API
    if (data && data.nombres) {
      return {
        cedula: cedula,
        nombreCompleto: `${data.nombres} ${data.apellidos}`,
        primerNombre: data.primerNombre || data.nombres.split(' ')[0],
        segundoNombre: data.segundoNombre || data.nombres.split(' ')[1] || '',
        primerApellido: data.primerApellido || data.apellidos.split(' ')[0],
        segundoApellido: data.segundoApellido || data.apellidos.split(' ')[1] || '',
      };
    }

    return null;
  } catch (error) {
    console.error('Error consultando cédula:', error);
    return null;
  }
}

export const authService = {
  /**
   * Inicia sesión con número de cédula
   */
  async login(cedula: string): Promise<AuthResponse> {
    const cleanedCedula = cedula.replace(/[.\s]/g, '');
    
    let user: User | null = null;

    if (API_CONFIG.demoMode) {
      // Modo demo: usar datos de prueba
      await delay(1000);
      user = DEMO_USERS[cleanedCedula] || null;
    } else {
      // Modo producción: consultar API real
      user = await consultarCedulaReal(cleanedCedula);
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
    await delay(300);
    // En producción, invalidar token en el servidor
  },

  /**
   * Verifica si el token es válido
   */
  async verifyToken(token: string): Promise<boolean> {
    await delay(200);
    return token.startsWith('token_');
  },
};

