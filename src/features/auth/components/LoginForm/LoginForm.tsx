import { ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

// Esquema de validación con Yup
const validationSchema = Yup.object({
  cedula: Yup.string()
    .matches(/^[0-9]*$/, 'Solo se permiten números')
    .min(10, 'La cédula debe tener mínimo 10 caracteres')
    .max(12, 'La cédula no puede tener más de 12 caracteres')
    .required('La cédula es requerida'),
});

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useAuth();

  const formik = useFormik({
    initialValues: {
      cedula: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const success = await login(values.cedula);
      if (success && onSuccess) {
        onSuccess();
      }
    },
  });

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    formik.setFieldValue('cedula', value);
    if (error) clearError();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>
          Ingresa tu número de cédula para acceder a tus certificados digitales
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Número de Cédula</label>
          <input
            type="text"
            className={`${styles.input} ${formik.touched.cedula && formik.errors.cedula ? styles.inputError : ''}`}
            placeholder="Ingresa tu cédula"
            name="cedula"
            value={formik.values.cedula}
            onChange={handleCedulaChange}
            onBlur={formik.handleBlur}
            maxLength={12}
            inputMode="numeric"
            autoComplete="off"
            disabled={isLoading}
          />
          {formik.touched.cedula && formik.errors.cedula && (
            <span className={styles.errorText}>{formik.errors.cedula}</span>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!formik.isValid || !formik.values.cedula || isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Verificando...
            </>
          ) : (
            <>
              Acceder
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className={styles.securityBadge}>
        <Lock size={14} />
        <span>Conexión segura y encriptada</span>
      </div>
    </div>
  );
};

