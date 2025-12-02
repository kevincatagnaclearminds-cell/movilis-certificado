import { useState, FormEvent } from 'react';
import { CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '../../hooks/useAuth';
import { isValidCedula, cleanCedula } from '@/utils';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [cedula, setCedula] = useState('');
  const [validationError, setValidationError] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCedula(value);
    setValidationError('');
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const cleanedCedula = cleanCedula(cedula);
    
    if (!isValidCedula(cleanedCedula)) {
      setValidationError('Ingresa una cédula válida (6-12 dígitos)');
      return;
    }

    const success = await login(cleanedCedula);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card variant="elevated" padding="lg" className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <CreditCard size={32} />
        </div>
        <h2 className={styles.title}>Consulta tus Certificados</h2>
        <p className={styles.description}>
          Ingresa tu número de cédula para acceder a tus certificados con firma electrónica
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Número de Cédula"
          placeholder="Ej: 1234567890"
          value={cedula}
          onChange={handleCedulaChange}
          leftIcon={<CreditCard size={20} />}
          error={validationError}
          hint="Ingresa solo números, sin puntos ni espacios"
          size="lg"
          maxLength={12}
          inputMode="numeric"
          autoComplete="off"
          disabled={isLoading}
        />

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight size={20} /> : undefined}
        >
          {isLoading ? 'Consultando...' : 'Consultar Certificados'}
        </Button>
      </form>

      <div className={styles.footer}>
        <p className={styles.securityNote}>
          🔒 Tus datos están protegidos con encriptación de extremo a extremo
        </p>
      </div>
    </Card>
  );
};

