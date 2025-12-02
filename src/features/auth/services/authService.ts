import type { AuthResponse, User } from '@/types';
import { delay, capitalizeWords } from '@/utils';

/**
 * Servicio de autenticación
 * En producción, estas funciones llamarían a tu API real
 */

// Datos de demostración
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
};

export const authService = {
  /**
   * Inicia sesión con número de cédula
   */
  async login(cedula: string): Promise<AuthResponse> {
    // Simular delay de red
    await delay(1000);

    // Limpiar cédula
    const cleanedCedula = cedula.replace(/[.\s]/g, '');

    // Buscar usuario (en producción, esto sería una llamada a la API)
    const user = DEMO_USERS[cleanedCedula];

    if (user) {
      return {
        success: true,
        user,
        token: `token_${Date.now()}`,
        message: 'Inicio de sesión exitoso',
      };
    }

    // Si no existe, crear uno genérico para demo
    // En producción, esto retornaría un error
    if (cleanedCedula.length >= 6) {
      const generatedUser: User = {
        cedula: cleanedCedula,
        nombreCompleto: capitalizeWords('Usuario Demo'),
        primerNombre: 'Usuario',
        primerApellido: 'Demo',
      };

      return {
        success: true,
        user: generatedUser,
        token: `token_${Date.now()}`,
        message: 'Inicio de sesión exitoso',
      };
    }

    return {
      success: false,
      message: 'Cédula no encontrada. Verifica el número ingresado.',
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

