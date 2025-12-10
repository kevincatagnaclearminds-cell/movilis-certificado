import { useState, useCallback, useEffect } from 'react';
import type { Certificado } from '@/types';
import { certificadosService } from '../services/certificadosService';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface UseCertificadosReturn {
  certificados: Certificado[];
  isLoading: boolean;
  error: string | null;
  downloadingId: string | null;
  fetchCertificados: () => Promise<void>;
  downloadCertificado: (certificado: Certificado) => Promise<void>;
}

export const useCertificados = (): UseCertificadosReturn => {
  const { user } = useAuth();
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchCertificados = useCallback(async () => {
    if (!user?.cedula) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await certificadosService.getCertificados(user.cedula, user.email);
      
      if (response.success) {
        setCertificados(response.certificados);
      } else {
        setError(response.message || 'Error al cargar certificados');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.cedula, user?.email]);

  const downloadCertificado = useCallback(async (certificado: Certificado) => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setDownloadingId(certificado.id);

    try {
      const blob = await certificadosService.downloadCertificado(certificado);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificado.titulo.replace(/\s+/g, '_')}_${certificado.codigoVerificacion}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descargar';
      setError(message);
    } finally {
      setDownloadingId(null);
    }
  }, [user]);

  // Cargar certificados automáticamente cuando hay usuario
  useEffect(() => {
    if (user?.cedula) {
      fetchCertificados();
    }
  }, [user?.cedula, fetchCertificados]);

  return {
    certificados,
    isLoading,
    error,
    downloadingId,
    fetchCertificados,
    downloadCertificado,
  };
};

