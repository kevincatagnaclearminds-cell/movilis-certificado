import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth';
import { LoginPage, DashboardPage, CreateCertificadoPage, CreateUserPage } from '@/pages';
import { ROUTES } from '@/config';
import { useAuth } from '@/features/auth';

// Componente para proteger rutas de admin
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route 
            path={ROUTES.CREAR_CERTIFICADO} 
            element={
              <AdminRoute>
                <CreateCertificadoPage />
              </AdminRoute>
            } 
          />
          <Route 
            path={ROUTES.CREAR_USUARIO} 
            element={
              <AdminRoute>
                <CreateUserPage />
              </AdminRoute>
            } 
          />
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

