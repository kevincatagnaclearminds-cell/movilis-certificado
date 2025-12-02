import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/config';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.gradient1} />
        <div className={styles.gradient2} />
        <div className={styles.pattern} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.brandSection}>
          <h1 className={styles.brandTitle}>Movilis</h1>
          <p className={styles.brandTagline}>
            Sistema de Certificados<br />con Firma Electrónica
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔐</span>
              <span>Certificados seguros</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✍️</span>
              <span>Firma electrónica válida</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📥</span>
              <span>Descarga inmediata</span>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

