import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Button } from '@/components/ui';
import { usersService } from '../../services/usersService';
import type { BackendUser } from '../../services/usersService';
import { ROUTES } from '@/config';
import styles from './UsersList.module.css';

export const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersData = await usersService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return styles.badgeAdmin;
      case 'issuer':
        return styles.badgeIssuer;
      default:
        return styles.badgeUser;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'issuer':
        return 'Emisor';
      default:
        return 'Usuario';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
        <p>Cargando usuarios...</p>
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
        <h2 className={styles.title}>Usuarios Registrados</h2>
        <div className={styles.headerActions}>
          <span className={styles.count}>{users.length} usuarios</span>
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.CREAR_USUARIO)}
            className={styles.createButton}
          >
            + Crear Usuario
          </Button>
        </div>
      </div>
      {users.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>{user.name}</td>
                  <td>{user.cedula}</td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`${styles.badge} ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={user.isActive ? styles.active : styles.inactive}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

