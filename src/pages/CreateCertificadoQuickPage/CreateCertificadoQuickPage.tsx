import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/features/auth';
import { certificadosService } from '@/features/certificados';
import { usersService, type BackendUser } from '@/features/users/services/usersService';
import { ROUTES } from '@/config';
import styles from './CreateCertificadoQuickPage.module.css';

type AssignMode = 'single' | 'multiple';

export const CreateCertificadoQuickPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [assignMode, setAssignMode] = useState<AssignMode>('single');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    courseName: '',
    institucion: 'Movilis',
    courseDescription: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (user?.role !== 'admin') {
      navigate(ROUTES.DASHBOARD);
      return;
    }
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

  const canSubmit = useMemo(() => {
    if (!formData.courseName.trim()) return false;
    if (assignMode === 'single') {
      return !!selectedUserId;
    }
    return selectedUserIds.length > 0;
  }, [formData.courseName, assignMode, selectedUserId, selectedUserIds.length]);

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.courseName.trim()) {
        throw new Error('El nombre del curso es requerido');
      }

      if (assignMode === 'single' && !selectedUserId) {
        throw new Error('Debes seleccionar un destinatario');
      }
      if (assignMode === 'multiple' && selectedUserIds.length === 0) {
        throw new Error('Debes seleccionar al menos un usuario');
      }

      await certificadosService.createCertificadoQuick({
        courseName: formData.courseName,
        institucion: formData.institucion,
        courseDescription: formData.courseDescription || undefined,
        expirationDate: formData.expirationDate || undefined,
        ...(assignMode === 'single'
          ? { destinatarioId: selectedUserId }
          : { userIds: selectedUserIds }),
      });

      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Error al crear el certificado (rápido)');
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
          <h1 className={styles.title}>Creación Rápida de Certificados</h1>
          <button
            className={styles.backButton}
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            ← Volver
          </button>
        </div>

        <div className={styles.note}>
          Usa esta opción para crear certificados con validaciones mínimas y asignarlos
          rápidamente a uno o varios usuarios.
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
              placeholder="Ej: Curso de Seguridad Vial"
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
            <span className={styles.label}>Asignar a</span>
            <div className={styles.options}>
              <label className={styles.inline}>
                <input
                  type="radio"
                  name="assignMode"
                  value="single"
                  checked={assignMode === 'single'}
                  onChange={() => setAssignMode('single')}
                />
                Un usuario
              </label>
              <label className={styles.inline}>
                <input
                  type="radio"
                  name="assignMode"
                  value="multiple"
                  checked={assignMode === 'multiple'}
                  onChange={() => setAssignMode('multiple')}
                />
                Varios usuarios
              </label>
            </div>

            {assignMode === 'single' ? (
              <>
                {loading && users.length === 0 ? (
                  <div className={styles.loading}>Cargando usuarios...</div>
                ) : (
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {users.map((u) => (
                      <option key={u.id || u._id} value={u.id || u._id}>
                        {u.name} - {u.email} ({u.cedula})
                      </option>
                    ))}
                  </select>
                )}
                <div className={styles.helper}>El certificado se asignará al usuario seleccionado.</div>
              </>
            ) : (
              <>
                {loading && users.length === 0 ? (
                  <div className={styles.loading}>Cargando usuarios...</div>
                ) : (
                  <div className={styles.usersList}>
                    {users.map((u) => {
                      const id = u.id || u._id;
                      const checked = selectedUserIds.includes(id);
                      return (
                        <label key={id} className={styles.userItem}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={checked}
                            onChange={() => toggleUserSelection(id)}
                          />
                          <span>{u.name} - {u.email} ({u.cedula})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                <div className={styles.helper}>
                  Puedes seleccionar múltiples usuarios. Se creará y asignará el certificado a todos.
                </div>
              </>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="courseDescription" className={styles.label}>
              Descripción (opcional)
            </label>
            <textarea
              id="courseDescription"
              value={formData.courseDescription}
              onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
              className={styles.textarea}
              rows={3}
              placeholder="Detalles del curso..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="expirationDate" className={styles.label}>
              Fecha de Expiración (Opcional, debe ser futura)
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
              disabled={loading || !canSubmit}
            >
              {loading ? 'Creando...' : 'Crear Certificado Rápido'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};


