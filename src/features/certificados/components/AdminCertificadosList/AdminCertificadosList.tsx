import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui';
import { certificadosService } from '../../services/certificadosService';
import { CertificadoCard } from '../CertificadoCard';
import { AssignCertificateModal } from '../AssignCertificateModal';
import type { Certificado } from '@/types';
import styles from './AdminCertificadosList.module.css';

export const AdminCertificadosList = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await certificadosService.getAllCertificados({ limit: 50 });
      if (response.success) {
        setCertificados(response.certificados || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar certificados');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
        <p>Cargando certificados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Todos los Certificados</h2>
        <span className={styles.count}>{certificados.length} certificados</span>
      </div>
      {certificados.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay certificados registrados</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {certificados.map((certificado) => {
              // Verificar si tiene múltiples usuarios asignados
              const assignedUsers = certificado.assignedUsers || certificado.usuariosAsignados || [];
              const hasMultipleUsers = assignedUsers.length > 1;
              const hasNoUsers = assignedUsers.length === 0;
              
              return (
                <div key={certificado.id} className={styles.cardWrapper}>
                  <CertificadoCard
                    certificado={certificado}
                    onDownload={() => {}}
                    isDownloading={false}
                    // Ocultar botón de descarga completamente en el dashboard de admin
                    showDownloadButton={false}
                  />
                  {hasMultipleUsers && (
                    <div className={styles.multipleUsersWarning}>
                      <span>⚠️ {assignedUsers.length} usuarios asignados</span>
                      <span className={styles.warningText}>
                        Descarga no disponible para múltiples usuarios
                      </span>
                    </div>
                  )}
                  {hasNoUsers && (
                    <div className={styles.noUsersWarning}>
                      <span>ℹ️ Sin usuarios asignados</span>
                    </div>
                  )}
                  <button
                    className={styles.assignButton}
                    onClick={() => {
                      setSelectedCertificado(certificado);
                      setIsModalOpen(true);
                    }}
                    title="Asignar a usuario"
                  >
                    {hasMultipleUsers ? 'Gestionar Usuarios' : 'Asignar Usuario'}
                  </button>
                </div>
              );
            })}
          </div>
          {selectedCertificado && (
            <AssignCertificateModal
              certificado={selectedCertificado}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedCertificado(null);
              }}
              onSuccess={() => {
                fetchCertificados(); // Refrescar la lista
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

