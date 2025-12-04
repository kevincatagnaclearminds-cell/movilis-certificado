import { API_CONFIG } from './constants';

/**
 * Cliente API para realizar peticiones HTTP al backend
 */

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Realiza una petición HTTP al backend
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Agregar token si existe
  const token = localStorage.getItem('movilis_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Agregar body si existe
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`🚀 [API] ${method} ${url}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) {
      console.log('✅ [API] Conexión exitosa:', data);
      return {
        success: true,
        data,
        message: data.message,
      };
    } else {
      console.error('❌ [API] Error en respuesta:', data);
      return {
        success: false,
        error: data.message || data.error || 'Error en la petición',
        message: data.message,
      };
    }
  } catch (error) {
    console.error('❌ [API] Error de conexión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión al servidor',
    };
  }
}

/**
 * Métodos HTTP del cliente API
 */
export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),

  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),

  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),
};

/**
 * Función para probar la conexión al backend
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    console.log('🔍 [API] Probando conexión al backend...');
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ [API] Backend conectado correctamente');
      return true;
    }
    return false;
  } catch {
    console.log('⚠️ [API] Backend no disponible, usando modo demo');
    return false;
  }
}

