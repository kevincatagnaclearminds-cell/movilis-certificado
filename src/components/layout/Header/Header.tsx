import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from './Header.module.css';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Shield size={28} />
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>Movilis</h1>
            <span className={styles.subtitle}>Sistema de Certificados</span>
          </div>
        </div>

        {isAuthenticated && user && (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.nombreCompleto}</span>
              <span className={styles.userCedula}>C.C. {user.cedula}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut size={18} />}
            >
              Salir
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

