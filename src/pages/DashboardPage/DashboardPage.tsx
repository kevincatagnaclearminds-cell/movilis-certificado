import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { CertificadosList } from '@/features/certificados';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/config';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <span className={styles.greeting}>Bienvenido,</span>
            <h1 className={styles.userName}>{user.nombreCompleto}</h1>
            <p className={styles.userInfo}>
              C.C. {user.cedula} {user.email && `• ${user.email}`}
            </p>
          </div>
        </div>

        <CertificadosList />
      </div>
    </MainLayout>
  );
};

