import type { Certificado, CertificadosResponse } from '@/types';
import { delay } from '@/utils';
import { API_CONFIG } from '@/config';

/**
 * Servicio de certificados
 * En producción, estas funciones llaman a la API real del backend
 */

// Datos de demostración (usados como fallback si el backend no está disponible)
const DEMO_CERTIFICADOS: Record<string, Certificado[]> = {
  '1234567890': [
    {
      id: 'cert-001',
      tipo: 'laboral',
      titulo: 'Certificado Laboral',
      descripcion: 'Certifica la vinculación laboral con la empresa desde el 15 de enero de 2020.',
      fechaEmision: '2024-01-15',
      fechaVencimiento: '2025-01-15',
      estado: 'vigente',
      entidadEmisora: 'Movilis S.A.S',
      codigoVerificacion: 'MOV-2024-001-XYZ',
      firmado: true,
    },
    {
      id: 'cert-002',
      tipo: 'ingresos',
      titulo: 'Certificado de Ingresos y Retenciones',
      descripcion: 'Certificado de ingresos y retenciones del año fiscal 2023.',
      fechaEmision: '2024-02-28',
      estado: 'vigente',
      entidadEmisora: 'Movilis S.A.S',
      codigoVerificacion: 'MOV-2024-002-ABC',
      firmado: true,
    },
    {
      id: 'cert-003',
      tipo: 'capacitacion',
      titulo: 'Certificado de Capacitación en Seguridad',
      descripcion: 'Certifica la culminación exitosa del curso de seguridad industrial.',
      fechaEmision: '2023-11-20',
      fechaVencimiento: '2024-11-20',
      estado: 'vigente',
      entidadEmisora: 'Instituto de Seguridad Industrial',
      codigoVerificacion: 'ISI-2023-1234',
      firmado: true,
    },
  ],
  '9876543210': [
    {
      id: 'cert-004',
      tipo: 'laboral',
      titulo: 'Certificado Laboral',
      descripcion: 'Certifica la vinculación laboral con la empresa.',
      fechaEmision: '2024-03-01',
      fechaVencimiento: '2025-03-01',
      estado: 'vigente',
      entidadEmisora: 'Movilis S.A.S',
      codigoVerificacion: 'MOV-2024-004-DEF',
      firmado: true,
    },
    {
      id: 'cert-005',
      tipo: 'participacion',
      titulo: 'Certificado de Participación - Congreso 2024',
      descripcion: 'Por su participación en el Congreso Nacional de Tecnología 2024.',
      fechaEmision: '2024-05-15',
      estado: 'vigente',
      entidadEmisora: 'Asociación Colombiana de Tecnología',
      codigoVerificacion: 'ACT-2024-5678',
      firmado: true,
    },
  ],
  '1122334455': [
    {
      id: 'cert-006',
      tipo: 'competencia',
      titulo: 'Certificado de Competencia Laboral',
      descripcion: 'Certificación de competencias en gestión de proyectos.',
      fechaEmision: '2023-08-10',
      fechaVencimiento: '2026-08-10',
      estado: 'vigente',
      entidadEmisora: 'SENA',
      codigoVerificacion: 'SENA-2023-9012',
      firmado: true,
    },
  ],
};

// Certificados genéricos para usuarios demo
const GENERIC_CERTIFICADOS: Certificado[] = [
  {
    id: 'cert-demo-001',
    tipo: 'capacitacion',
    titulo: 'Certificado de Marketing Digital',
    descripcion: 'Certifica la aprobación del curso de Marketing Digital con énfasis en estrategias de redes sociales y publicidad online.',
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estado: 'vigente',
    entidadEmisora: 'Movilis S.A.S',
    codigoVerificacion: `MOV-MKT-${Date.now()}`,
    firmado: true,
  },
  {
    id: 'cert-demo-002',
    tipo: 'capacitacion',
    titulo: 'Certificado de Comunicación',
    descripcion: 'Certifica la aprobación del curso de Comunicación Efectiva y Relaciones Públicas.',
    fechaEmision: new Date().toISOString().split('T')[0],
    estado: 'vigente',
    entidadEmisora: 'Movilis S.A.S',
    codigoVerificacion: `MOV-COM-${Date.now()}`,
    firmado: true,
  },
];

export const certificadosService = {
  /**
   * Obtiene los certificados de un usuario desde el backend
   */
  async getCertificados(cedula: string, userEmail?: string): Promise<CertificadosResponse> {
    try {
      // Si hay email del usuario, usar el endpoint del backend
      if (userEmail) {
        const token = localStorage.getItem('movilis_token');
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/certificados/recipient?email=${encodeURIComponent(userEmail)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Transformar los datos del backend al formato del frontend
            const certificados = data.data.map((cert: any) => ({
              id: cert._id || cert.id,
              tipo: 'capacitacion', // Tipo por defecto, ajustar según necesidad
              titulo: cert.courseName || 'Certificado',
              descripcion: cert.courseDescription || '',
              fechaEmision: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              fechaVencimiento: cert.expirationDate ? new Date(cert.expirationDate).toISOString().split('T')[0] : undefined,
              estado: cert.status === 'issued' ? 'vigente' : cert.status,
              entidadEmisora: 'Movilis',
              codigoVerificacion: cert.verificationCode || cert.certificateNumber,
              firmado: cert.status === 'issued',
            }));

            return {
              success: true,
              certificados,
              total: certificados.length,
            };
          }
        }
      }

      // Fallback a datos demo si no hay email o falla la conexión
      await delay(800);
      const cleanedCedula = cedula.replace(/[.\s]/g, '');
      const certificados = DEMO_CERTIFICADOS[cleanedCedula] || GENERIC_CERTIFICADOS;

      return {
        success: true,
        certificados,
        total: certificados.length,
      };
    } catch (error) {
      console.error('Error obteniendo certificados:', error);
      // Fallback a datos demo en caso de error
      await delay(800);
      const cleanedCedula = cedula.replace(/[.\s]/g, '');
      const certificados = DEMO_CERTIFICADOS[cleanedCedula] || GENERIC_CERTIFICADOS;

      return {
        success: true,
        certificados,
        total: certificados.length,
      };
    }
  },

  /**
   * Obtiene un certificado por ID
   */
  async getCertificadoById(id: string): Promise<Certificado | null> {
    await delay(300);

    for (const certs of Object.values(DEMO_CERTIFICADOS)) {
      const found = certs.find(c => c.id === id);
      if (found) return found;
    }

    const genericFound = GENERIC_CERTIFICADOS.find(c => c.id === id);
    return genericFound || null;
  },

  /**
   * Descarga un certificado desde el backend
   */
  async downloadCertificado(certificado: Certificado): Promise<Blob> {
    try {
      const certificateId = certificado.id;
      
      if (!certificateId) {
        throw new Error('ID de certificado no disponible');
      }

      // Convertir ID a string si es número (PostgreSQL usa SERIAL)
      const idString = String(certificateId);
      
      // Verificar si es un ID de demo (solo si parece ser un string de demo)
      if (idString.startsWith('cert-demo-')) {
        throw new Error('Los certificados de demostración no se pueden descargar. Por favor, crea un certificado real desde el sistema.');
      }

      // Llamar al endpoint del backend para descargar el PDF
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/certificados/${certificateId}/download`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error al descargar certificado: ${response.statusText}`);
      }

      // El backend devuelve el PDF directamente
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error descargando certificado:', error);
      throw error;
    }
  },

  /**
   * Verifica la autenticidad de un certificado
   */
  async verifyCertificado(codigoVerificacion: string): Promise<boolean> {
    await delay(500);
    // En producción, verificaría contra la base de datos
    return codigoVerificacion.startsWith('MOV-') || 
           codigoVerificacion.startsWith('SENA-') ||
           codigoVerificacion.startsWith('ISI-') ||
           codigoVerificacion.startsWith('ACT-');
  },

  /**
   * Crea un nuevo certificado
   */
  async createCertificado(certificadoData: {
    courseName: string;
    institucion?: string;
    destinatarioId: string;
    courseDescription?: string;
    expirationDate?: string;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/certificados/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: certificadoData.courseName,
          institucion: certificadoData.institucion || 'Movilis',
          destinatarioId: certificadoData.destinatarioId,
          courseDescription: certificadoData.courseDescription || '',
          ...(certificadoData.expirationDate && { expirationDate: certificadoData.expirationDate }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.error?.errors?.[0]?.msg || `Error al crear certificado: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando certificado:', error);
      throw error;
    }
  },

  /**
   * Crea un certificado de forma rápida (endpoint /quick)
   * Permite asignar a un único destinatario o a múltiples usuarios (userIds).
   */
  async createCertificadoQuick(certificadoData: {
    courseName: string;
    institucion?: string;
    destinatarioId?: string;
    userIds?: string[];
    courseDescription?: string;
    expirationDate?: string;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('movilis_token');
      const payload: Record<string, unknown> = {
        courseName: certificadoData.courseName,
        institucion: certificadoData.institucion || 'Movilis',
      };

      if (certificadoData.destinatarioId) {
        payload.destinatarioId = certificadoData.destinatarioId;
      }
      if (certificadoData.userIds && certificadoData.userIds.length > 0) {
        payload.userIds = certificadoData.userIds;
      }
      if (certificadoData.courseDescription) {
        payload.courseDescription = certificadoData.courseDescription;
      }
      if (certificadoData.expirationDate) {
        payload.expirationDate = certificadoData.expirationDate;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/certificados/quick`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.error?.errors?.[0]?.msg || `Error al crear certificado (rápido): ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando certificado (rápido):', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los certificados (solo admin)
   */
  async getAllCertificados(options: { page?: number; limit?: number; status?: string } = {}): Promise<CertificadosResponse> {
    try {
      const token = localStorage.getItem('movilis_token');
      const queryParams = new URLSearchParams();
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.status) queryParams.append('status', options.status);

      const response = await fetch(`${API_CONFIG.BASE_URL}/certificados?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener certificados: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        const certificados = data.data.map((cert: any) => ({
          id: cert._id || cert.id,
          tipo: 'capacitacion',
          titulo: cert.courseName || 'Certificado',
          descripcion: cert.courseDescription || '',
          fechaEmision: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          fechaVencimiento: cert.expirationDate ? new Date(cert.expirationDate).toISOString().split('T')[0] : undefined,
          estado: cert.status === 'issued' ? 'vigente' : cert.status,
          entidadEmisora: cert.institucion || 'Movilis',
          codigoVerificacion: cert.verificationCode || cert.certificateNumber,
          firmado: cert.status === 'issued',
          recipientName: cert.recipientName,
          recipientEmail: cert.recipientEmail,
          issuerName: cert.issuerName,
          // Usuarios asignados (para relación muchos-a-muchos)
          assignedUsers: cert.assignedUsers || cert.usuariosAsignados || [],
          usuariosAsignados: cert.usuariosAsignados || cert.assignedUsers || [],
        }));

        return {
          success: true,
          certificados,
          total: data.pagination?.total || certificados.length,
        };
      }

      return {
        success: true,
        certificados: [],
        total: 0,
      };
    } catch (error) {
      console.error('Error obteniendo todos los certificados:', error);
      throw error;
    }
  },

  /**
   * Actualiza un certificado (solo admin)
   */
  async updateCertificado(certificadoId: string, updateData: {
    destinatarioId?: string;
    courseName?: string;
    institucion?: string;
    expirationDate?: string;
    status?: string;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/certificados/${certificadoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error al actualizar certificado: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando certificado:', error);
      throw error;
    }
  },
};

