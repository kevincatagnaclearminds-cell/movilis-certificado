import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { CertificadosList, AdminCertificadosList } from '@/features/certificados';
import { UsersList } from '@/features/users/components/UsersList';
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

  const isAdmin = user.role === 'admin';

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <span className={styles.greeting}>Bienvenido</span>
            <h1 className={styles.userName}>{user.nombreCompleto}</h1>
            <p className={styles.userInfo}>
              C.C. {user.cedula} {user.email && `• ${user.email}`}
            </p>
          </div>
          {isAdmin && (
            <div className={styles.adminActions}>
              <button
                className={styles.createButton}
                onClick={() => navigate(ROUTES.CREAR_USUARIO)}
              >
                + Crear Usuario
              </button>
              <button
                className={styles.createButton}
                onClick={() => navigate(ROUTES.CREAR_CERTIFICADO)}
              >
                + Crear Certificado
              </button>
            </div>
          )}
        </div>

        {isAdmin ? (
          <>
            <UsersList />
            <AdminCertificadosList />
          </>
        ) : (
          <CertificadosList />
        )}
      </div>
    </MainLayout>
  );
};

