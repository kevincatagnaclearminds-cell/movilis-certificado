import { 
  Download, 
  Calendar, 
  Building, 
  FileCheck, 
  Briefcase,
  DollarSign,
  GraduationCap,
  Award,
  Trophy,
  FileText
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import type { Certificado, CertificadoTipo, CertificadoEstado } from '@/types';
import { formatDate } from '@/utils';
import styles from './CertificadoCard.module.css';

interface CertificadoCardProps {
  certificado: Certificado;
  onDownload: (certificado: Certificado) => void;
  isDownloading?: boolean;
}

const TIPO_ICONS: Record<CertificadoTipo, React.ReactNode> = {
  laboral: <Briefcase size={24} />,
  ingresos: <DollarSign size={24} />,
  capacitacion: <GraduationCap size={24} />,
  participacion: <Award size={24} />,
  competencia: <Trophy size={24} />,
  otro: <FileText size={24} />,
};

const TIPO_COLORS: Record<CertificadoTipo, string> = {
  laboral: '#3B82F6',
  ingresos: '#10B981',
  capacitacion: '#8B5CF6',
  participacion: '#F59E0B',
  competencia: '#EF4444',
  otro: '#6B7280',
};

const TIPO_LABELS: Record<CertificadoTipo, string> = {
  laboral: 'Laboral',
  ingresos: 'Ingresos',
  capacitacion: 'Capacitación',
  participacion: 'Participación',
  competencia: 'Competencia',
  otro: 'Otro',
};

const ESTADO_VARIANTS: Record<CertificadoEstado, 'success' | 'error' | 'warning' | 'default'> = {
  vigente: 'success',
  vencido: 'error',
  revocado: 'default',
  pendiente: 'warning',
};

const ESTADO_LABELS: Record<CertificadoEstado, string> = {
  vigente: 'Vigente',
  vencido: 'Vencido',
  revocado: 'Revocado',
  pendiente: 'Pendiente',
};

export const CertificadoCard = ({ 
  certificado, 
  onDownload, 
  isDownloading = false 
}: CertificadoCardProps) => {
  const tipoColor = TIPO_COLORS[certificado.tipo];

  return (
    <Card variant="default" padding="none" hoverable className={styles.card}>
      <div className={styles.header} style={{ borderLeftColor: tipoColor }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${tipoColor}15`, color: tipoColor }}>
          {TIPO_ICONS[certificado.tipo]}
        </div>
        <div className={styles.headerContent}>
          <div className={styles.badges}>
            <Badge size="sm" style={{ backgroundColor: `${tipoColor}15`, color: tipoColor }}>
              {TIPO_LABELS[certificado.tipo]}
            </Badge>
            <Badge size="sm" variant={ESTADO_VARIANTS[certificado.estado]} dot>
              {ESTADO_LABELS[certificado.estado]}
            </Badge>
          </div>
          <h3 className={styles.title}>{certificado.titulo}</h3>
        </div>
      </div>

      <div className={styles.body}>
        {certificado.descripcion && (
          <p className={styles.description}>{certificado.descripcion}</p>
        )}

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>Emitido: {formatDate(certificado.fechaEmision)}</span>
          </div>
          {certificado.fechaVencimiento && (
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span>Vence: {formatDate(certificado.fechaVencimiento)}</span>
            </div>
          )}
          <div className={styles.metaItem}>
            <Building size={16} />
            <span>{certificado.entidadEmisora}</span>
          </div>
          <div className={styles.metaItem}>
            <FileCheck size={16} />
            <span>Código: {certificado.codigoVerificacion}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {certificado.firmado && (
          <div className={styles.signedBadge}>
            <FileCheck size={14} />
            <span>Firmado electrónicamente</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onDownload(certificado)}
          isLoading={isDownloading}
          leftIcon={!isDownloading ? <Download size={16} /> : undefined}
          disabled={certificado.estado === 'revocado'}
        >
          {isDownloading ? 'Descargando...' : 'Descargar PDF'}
        </Button>
      </div>
    </Card>
  );
};

