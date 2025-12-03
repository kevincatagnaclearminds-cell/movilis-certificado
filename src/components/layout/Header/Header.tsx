import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import movilisImage from '@/assets/images/movilis.png';
import styles from './Header.module.css';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src={movilisImage} alt="Movilis" className={styles.logo} />
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

