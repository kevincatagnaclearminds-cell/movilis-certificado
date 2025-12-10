import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { usersService } from '@/features/users/services/usersService';
import { ROUTES } from '@/config';
import styles from './CreateUserPage.module.css';

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'issuer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!formData.cedula.trim() || !formData.name.trim()) {
        throw new Error('La cédula y el nombre son requeridos');
      }

      await usersService.createUser({
        cedula: formData.cedula.trim(),
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        role: formData.role,
      });

      setSuccessMessage('Usuario creado exitosamente');
      
      // Limpiar formulario
      setFormData({
        cedula: '',
        name: '',
        email: '',
        role: 'user',
      });

      // Opcional: redirigir después de 2 segundos
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Nuevo Usuario</h1>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className={styles.backButton}
          >
            ← Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <div className={styles.field}>
            <label htmlFor="cedula" className={styles.label}>
              Cédula *
            </label>
            <Input
              id="cedula"
              type="text"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              required
              placeholder="Ej: 1234567890"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Nombre Completo *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email (opcional)
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ej: juan@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              Rol *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' | 'issuer' })}
              className={styles.select}
              required
            >
              <option value="user">Usuario</option>
              <option value="issuer">Emisor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

