import { useNavigate } from 'react-router-dom';
import { Shield, FileCheck, Clock, Award } from 'lucide-react';
import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/config';
import movilisLogo from '@/assets/images/movilis.png';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.page}>
      {/* Panel izquierdo - Branding */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <img src={movilisLogo} alt="Movilis" className={styles.logo} />
          <h1 className={styles.brandTitle}>MOVILIS</h1>
          <p className={styles.brandSubtitle}>Sistema de Certificados Digitales</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Shield size={24} />
              </div>
              <div className={styles.featureText}>
                <h3>Seguridad Garantizada</h3>
                <p>Protección de datos con encriptación avanzada</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FileCheck size={24} />
              </div>
              <div className={styles.featureText}>
                <h3>Firma Electrónica</h3>
                <p>Certificados con validez legal</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.featureText}>
                <h3>Acceso Inmediato</h3>
                <p>Descarga tus certificados al instante</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.brandFooter}>
          <Award size={16} />
          <span>Plataforma certificada y segura</span>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
        
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Movilis. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

