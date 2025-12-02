import { FileX, RefreshCw } from 'lucide-react';
import { Spinner, Button } from '@/components/ui';
import { CertificadoCard } from '../CertificadoCard';
import { useCertificados } from '../../hooks/useCertificados';
import styles from './CertificadosList.module.css';

export const CertificadosList = () => {
  const { 
    certificados, 
    isLoading, 
    error, 
    downloadingId,
    fetchCertificados,
    downloadCertificado 
  } = useCertificados();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
        <p>Cargando tus certificados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <div className={styles.errorIcon}>
          <FileX size={48} />
        </div>
        <h3>Error al cargar certificados</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={fetchCertificados}
          leftIcon={<RefreshCw size={18} />}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (certificados.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <FileX size={48} />
        </div>
        <h3>Sin certificados</h3>
        <p>No tienes certificados disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tus Certificados</h2>
        <p className={styles.subtitle}>
          {certificados.length} certificado{certificados.length !== 1 ? 's' : ''} disponible{certificados.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.grid}>
        {certificados.map((certificado) => (
          <CertificadoCard
            key={certificado.id}
            certificado={certificado}
            onDownload={downloadCertificado}
            isDownloading={downloadingId === certificado.id}
          />
        ))}
      </div>
    </div>
  );
};

