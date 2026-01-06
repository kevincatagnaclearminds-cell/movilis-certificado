import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { usersService } from '@/features/users/services/usersService';
import type { BackendUser } from '@/features/users/services/usersService';
import type { Certificado } from '@/types';
import styles from './AssignCertificateModal.module.css';

interface AssignCertificateModalProps {
  certificado: Certificado;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignCertificateModal = ({
  certificado,
  isOpen,
  onClose,
  onSuccess,
}: AssignCertificateModalProps) => {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<BackendUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchAssignedUsers();
      setSelectedUserIds([]); // Reset al abrir
    }
  }, [isOpen, certificado.id]);

  // Cargar usuarios ya asignados
  const fetchAssignedUsers = async () => {
    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/certificados/${certificado.id}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAssignedUsers(data.data);
          // Pre-seleccionar usuarios ya asignados
          setSelectedUserIds(data.data.map((u: BackendUser) => u.id || u._id));
        }
      }
    } catch (err) {
      console.error('Error cargando usuarios asignados:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersData = await usersService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      setError('Debes seleccionar al menos un usuario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('movilis_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/certificados/${certificado.id}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Error al asignar certificado');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al asignar certificado');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Asignar Certificado a Usuarios</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.certificateInfo}>
            <p><strong>Certificado:</strong> {certificado.titulo}</p>
            <p><strong>Número:</strong> {certificado.codigoVerificacion}</p>
            {assignedUsers.length > 0 && (
              <p><strong>Usuarios asignados actualmente:</strong> {assignedUsers.map(u => u.name).join(', ')}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>
                Seleccionar Usuarios (puedes seleccionar múltiples) *
              </label>
              {loadingUsers ? (
                <div className={styles.loading}>Cargando usuarios...</div>
              ) : (
                <div className={styles.usersList}>
                  {users.map((user) => (
                    <label key={user.id || user._id} className={styles.userCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id || user._id)}
                        onChange={() => handleToggleUser(user.id || user._id)}
                      />
                      <span>
                        {user.name} ({user.email || user.cedula})
                      </span>
                    </label>
                  ))}
                  {users.length === 0 && (
                    <p className={styles.noUsers}>No hay usuarios disponibles</p>
                  )}
                </div>
              )}
            </div>

            {selectedUserIds.length > 0 && (
              <div className={styles.selectedCount}>
                {selectedUserIds.length} usuario(s) seleccionado(s)
              </div>
            )}

            <div className={styles.actions}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || selectedUserIds.length === 0}>
                {loading ? 'Asignando...' : `Asignar a ${selectedUserIds.length} usuario(s)`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

