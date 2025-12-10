import { API_CONFIG } from '@/config';

export interface BackendUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  cedula: string;
  role: 'admin' | 'user' | 'issuer';
}

export interface UsersResponse {
  success: boolean;
  data: BackendUser[];
}

/**
 * Servicio para obtener usuarios (solo admin)
 */
export const usersService = {
  /**
   * Crea un nuevo usuario (solo admin)
   */
  async createUser(userData: {
    cedula: string;
    name: string;
    email?: string;
    role?: 'admin' | 'user' | 'issuer';
  }): Promise<BackendUser> {
    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error al crear usuario: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de usuarios (solo admin)
   */
  async getUsers(): Promise<BackendUser[]> {
    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tienes permisos para ver usuarios');
        }
        throw new Error(`Error al obtener usuarios: ${response.statusText}`);
      }

      const data: UsersResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },
};

