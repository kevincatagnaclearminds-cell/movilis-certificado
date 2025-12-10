import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/features/auth';
import { certificadosService } from '@/features/certificados';
import { usersService, type BackendUser } from '@/features/users/services/usersService';
import { ROUTES } from '@/config';
import styles from './CreateCertificadoPage.module.css';

export const CreateCertificadoPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseName: '',
    institucion: 'Movilis',
    destinatarioId: '',
    courseDescription: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Verificar que sea admin
    if (user?.role !== 'admin') {
      navigate(ROUTES.DASHBOARD);
      return;
    }

    // Cargar usuarios
    loadUsers();
  }, [isAuthenticated, user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersList = await usersService.getUsers();
      setUsers(usersList);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.destinatarioId) {
        throw new Error('Debes seleccionar un destinatario');
      }

      if (!formData.courseName.trim()) {
        throw new Error('El nombre del curso es requerido');
      }

      await certificadosService.createCertificado({
        courseName: formData.courseName,
        institucion: formData.institucion,
        destinatarioId: formData.destinatarioId,
        courseDescription: formData.courseDescription,
        expirationDate: formData.expirationDate || undefined,
      });

      // Redirigir al dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Error al crear el certificado');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Nuevo Certificado</h1>
          <button
            className={styles.backButton}
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            ← Volver
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="courseName" className={styles.label}>
              Nombre del Curso *
            </label>
            <input
              id="courseName"
              type="text"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className={styles.input}
              required
              placeholder="Ej: Curso de Programación en JavaScript"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="institucion" className={styles.label}>
              Institución
            </label>
            <input
              id="institucion"
              type="text"
              value={formData.institucion}
              onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
              className={styles.input}
              placeholder="Movilis"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="destinatarioId" className={styles.label}>
              Destinatario *
            </label>
            {loading && users.length === 0 ? (
              <div className={styles.loading}>Cargando usuarios...</div>
            ) : (
              <select
                id="destinatarioId"
                value={formData.destinatarioId}
                onChange={(e) => setFormData({ ...formData, destinatarioId: e.target.value })}
                className={styles.select}
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id || user._id} value={user.id || user._id}>
                    {user.name} - {user.email} ({user.cedula})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="courseDescription" className={styles.label}>
              Descripción del Curso
            </label>
            <textarea
              id="courseDescription"
              value={formData.courseDescription}
              onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
              className={styles.textarea}
              rows={4}
              placeholder="Descripción detallada del curso..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="expirationDate" className={styles.label}>
              Fecha de Expiración (Opcional)
            </label>
            <input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className={styles.input}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Certificado'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

