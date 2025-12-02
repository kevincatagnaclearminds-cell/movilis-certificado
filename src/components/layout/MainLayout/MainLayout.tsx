import { ReactNode } from 'react';
import { Header } from '../Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      {showHeader && <Header />}
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Movilis. Todos los derechos reservados.</p>
        <p className={styles.footerSubtext}>
          Certificados con firma electrónica avalados
        </p>
      </footer>
    </div>
  );
};

