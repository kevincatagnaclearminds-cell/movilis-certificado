import type { Certificado, CertificadosResponse, User } from '@/types';
import { delay } from '@/utils';
import { generateCertificadoPDF } from '../utils/pdfGenerator';

/**
 * Servicio de certificados
 * En producción, estas funciones llamarían a tu API real
 */

// Datos de demostración
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
    tipo: 'laboral',
    titulo: 'Certificado Laboral',
    descripcion: 'Certificado de vinculación laboral actualizado.',
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estado: 'vigente',
    entidadEmisora: 'Movilis S.A.S',
    codigoVerificacion: `MOV-DEMO-${Date.now()}`,
    firmado: true,
  },
  {
    id: 'cert-demo-002',
    tipo: 'ingresos',
    titulo: 'Certificado de Ingresos',
    descripcion: 'Certificado de ingresos del periodo actual.',
    fechaEmision: new Date().toISOString().split('T')[0],
    estado: 'vigente',
    entidadEmisora: 'Movilis S.A.S',
    codigoVerificacion: `MOV-ING-${Date.now()}`,
    firmado: true,
  },
];

export const certificadosService = {
  /**
   * Obtiene los certificados de un usuario por cédula
   */
  async getCertificados(cedula: string): Promise<CertificadosResponse> {
    // Simular delay de red
    await delay(800);

    const cleanedCedula = cedula.replace(/[.\s]/g, '');
    const certificados = DEMO_CERTIFICADOS[cleanedCedula] || GENERIC_CERTIFICADOS;

    return {
      success: true,
      certificados,
      total: certificados.length,
    };
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
   * Descarga un certificado (genera un PDF usando la plantilla)
   */
  async downloadCertificado(certificado: Certificado, user: User): Promise<Blob> {
    await delay(1500);

    // Generar el PDF usando el generador con los datos del usuario
    const pdfBytes = await generateCertificadoPDF(certificado, user);
    
    // Convertir Uint8Array a Blob
    // pdfBytes es un Uint8Array, que es compatible con Blob
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
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
};

